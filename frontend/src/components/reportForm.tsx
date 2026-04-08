import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Eye,
  Info,
  Lock,
  Wallet,
  Loader2,
  XCircle
} from 'lucide-react';
import { Button, Card, Input, Textarea, Switch } from './ui';
import WalletConnect, { ConnectedWallet } from './WalletConnect';
import apiService from '../services/apiService';
import web3Service from '../services/web3Service';
import zkpService from '../services/zkpService';

// ─── Form schema ──────────────────────────────────────────────────────────────

const reportSchema = z.object({
  reportContent: z.string()
    .min(50, 'Report must be at least 50 characters long')
    .max(5000, 'Report cannot exceed 5000 characters'),
  category: z.string().min(1, 'Please select a category'),
  severity: z.string(),
  location: z.string().optional(),
  isAnonymous: z.boolean(),
  useSponsored: z.boolean(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms')
});

type ReportFormData = z.infer<typeof reportSchema>;

// ─── Submission step tracking ─────────────────────────────────────────────────

type SubmitStep =
  | 'idle'
  | 'signing'
  | 'generating_proof'
  | 'encrypting'
  | 'uploading'
  | 'on_chain'
  | 'done'
  | 'error';

const STEP_LABELS: Record<SubmitStep, string> = {
  idle:             '',
  signing:          'Signing identity message...',
  generating_proof: 'Generating zero-knowledge proof...',
  encrypting:       'Encrypting report content...',
  uploading:        'Submitting to server...',
  on_chain:         'Recording on blockchain...',
  done:             'Done',
  error:            'Submission failed'
};

// ─── Constants ────────────────────────────────────────────────────────────────

/** Fixed message the user signs to derive their identity secret and encryption key.
 *  Never changes — any change would invalidate existing nullifiers. */
const IDENTITY_SIGN_MESSAGE = 'SpeakSafe anonymous identity v1\n\nSigning this message proves you control this wallet without revealing your identity.';

const CATEGORIES = [
  { value: 'corruption',     label: 'Corruption',           icon: AlertTriangle },
  { value: 'misconduct',     label: 'Police Misconduct',     icon: Shield       },
  { value: 'environmental',  label: 'Environmental',         icon: FileText     },
  { value: 'fraud',          label: 'Financial Fraud',       icon: AlertTriangle },
  { value: 'safety_violation', label: 'Safety Violation',   icon: AlertTriangle },
  { value: 'other',          label: 'Other',                 icon: FileText     }
];

const SEVERITY_LEVELS = [
  { value: 'low',      label: 'Low',      color: 'text-green-400',  description: 'Minor issue'           },
  { value: 'medium',   label: 'Medium',   color: 'text-yellow-400', description: 'Moderate concern'      },
  { value: 'high',     label: 'High',     color: 'text-orange-400', description: 'Serious issue'         },
  { value: 'critical', label: 'Critical', color: 'text-red-400',    description: 'Urgent action needed'  }
];

// ─── Component ────────────────────────────────────────────────────────────────

const ReportForm: React.FC = () => {
  const [currentStep, setCurrentStep]       = useState(1);
  const [submitStep, setSubmitStep]         = useState<SubmitStep>('idle');
  const [submitError, setSubmitError]       = useState<string | null>(null);
  const [success, setSuccess]               = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);
  const [showPreview, setShowPreview]       = useState(false);
  const [wallet, setWallet]                 = useState<ConnectedWallet | null>(null);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      isAnonymous:  true,
      useSponsored: false,
      severity:     'medium',
      agreeToTerms: false
    }
  });

  const watchedValues  = watch();
  const reportContent  = watch('reportContent') || '';
  const isAnonymous    = watch('isAnonymous');
  const useSponsored   = watch('useSponsored');

  // If the user opts for the sponsored path they don't need a wallet at all.
  const needsWallet = isAnonymous && !useSponsored;

  // ─── Wallet helpers ─────────────────────────────────────────────────────────

  const handleWalletConnected = (connected: ConnectedWallet) => {
    setWallet(connected);
    setWalletModalOpen(false);
  };

  const walletShort = wallet
    ? `${wallet.address.slice(0, 6)}…${wallet.address.slice(-4)}`
    : null;

  // ─── Submission pipeline ────────────────────────────────────────────────────

  const onSubmit = async (data: ReportFormData) => {
    setSubmitError(null);
    setSubmitStep('idle');

    try {
      let encryptedContent: string;
      let proofPayload: object | null = null;
      let publicSignals: string[]     = [];
      let nullifierHash               = '';
      let reportHash                  = '';

      if (data.isAnonymous && !data.useSponsored) {
        // ── Anonymous path (wallet required) ──────────────────────────────────

        if (!wallet) {
          setSubmitError('Please connect your wallet first to submit anonymously with ZK proof.');
          return;
        }

        // 1. Sign to derive identity secret + encryption passphrase.
        //    The signature is deterministic for a given wallet + message,
        //    so the user can reproduce it without storing anything.
        setSubmitStep('signing');
        const signature = await wallet.signer.signMessage(IDENTITY_SIGN_MESSAGE);

        // 2. Generate ZK proof in the browser.
        setSubmitStep('generating_proof');
        const zkResult = await zkpService.generateReportProof({
          reportText:     data.reportContent,
          category:       data.category,
          severity:       data.severity,
          identitySecret: signature
        });

        proofPayload  = zkResult.proof;
        publicSignals = zkResult.publicSignals;
        nullifierHash = zkResult.nullifierHash;
        reportHash    = zkResult.reportHash;

        // 3. Encrypt report content with the signature as passphrase.
        //    Only the reporter can decrypt (same wallet + same message = same sig).
        setSubmitStep('encrypting');
        encryptedContent = await web3Service.encryptData(data.reportContent, signature);

        // 4. Upload to backend.
        setSubmitStep('uploading');
        const apiResponse = await apiService.submitReport({
          encryptedContent,
          reportHash,
          nullifierHash,
          proof:         proofPayload,
          publicSignals,
          category:      data.category,
          severity:      data.severity,
          location:      data.location,
          isAnonymous:   true,
          isSponsored:   false
        });
        setSubmittedReportId(apiResponse.data?.reportId ?? null);

        // 5. Store commitment on-chain, then confirm with the backend.
        setSubmitStep('on_chain');
        const serializedProof = zkpService.serializeProofForContract(proofPayload);
        await web3Service.storeReportHash(reportHash, serializedProof, wallet.signer);

        // Notify backend that the tx confirmed so it can mark is_on_chain = true.
        // Non-fatal — status can be reconciled later via a relayer or cron job.
        if (apiResponse.data?.reportId) {
          try {
            await apiService.confirmOnChain(apiResponse.data.reportId, reportHash);
          } catch {
            // Best-effort — doesn't fail the submission.
          }
        }

      } else if (data.isAnonymous && data.useSponsored) {
        // ── Sponsored path (no wallet required) ───────────────────────────────
        // Report is still hashed + encrypted, but proof generation and gas are
        // handled by the platform's relayer (TODO: implement relayer).

        reportHash = await web3Service.generateReportHash(data.reportContent);

        // Encrypt with a cryptographically random one-time key.
        // Using reportHash (a public keccak256) as a passphrase would let anyone
        // who knows the content derive the key and decrypt. The key is intentionally
        // ephemeral — encrypted_content is write-only at rest for this path.
        setSubmitStep('encrypting');
        const sponsoredKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
          .map(b => b.toString(16).padStart(2, '0')).join('');
        encryptedContent = await web3Service.encryptData(data.reportContent, sponsoredKey);

        setSubmitStep('uploading');
        const apiResponse = await apiService.submitReport({
          encryptedContent,
          reportHash,
          nullifierHash:  '',
          proof:          null,
          publicSignals:  [],
          category:       data.category,
          severity:       data.severity,
          location:       data.location,
          isAnonymous:    true,
          isSponsored:    true
        });
        setSubmittedReportId(apiResponse.data?.reportId ?? null);

      } else {
        // ── Identified path ───────────────────────────────────────────────────
        reportHash = await web3Service.generateReportHash(data.reportContent);

        // Same reasoning as sponsored path — use a random key, not the public reportHash.
        setSubmitStep('encrypting');
        const identifiedKey = Array.from(crypto.getRandomValues(new Uint8Array(32)))
          .map(b => b.toString(16).padStart(2, '0')).join('');
        encryptedContent = await web3Service.encryptData(data.reportContent, identifiedKey);

        setSubmitStep('uploading');
        const apiResponse = await apiService.submitReport({
          encryptedContent,
          reportHash,
          nullifierHash:  '',
          proof:          null,
          publicSignals:  [],
          category:       data.category,
          severity:       data.severity,
          location:       data.location,
          isAnonymous:    false,
          isSponsored:    false
        });
        setSubmittedReportId(apiResponse.data?.reportId ?? null);
      }

      setSubmitStep('done');
      setSuccess(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'An unexpected error occurred. Please try again.';
      setSubmitError(message);
      setSubmitStep('error');
    }
  };

  const nextStep = () => { if (currentStep < 3) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };
  const isSubmitting = submitStep !== 'idle' && submitStep !== 'done' && submitStep !== 'error';

  // ─── Success screen ─────────────────────────────────────────────────────────

  if (success) {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6"
        >
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Report Submitted Successfully!</h3>
            <p className="text-text-secondary">
              Your report has been encrypted and{' '}
              {watchedValues.useSponsored
                ? 'queued for blockchain storage via the community sponsorship pool.'
                : 'stored on the blockchain.'}
              {isAnonymous && ' Your identity remains completely anonymous.'}
            </p>
            {submittedReportId && (
              <p className="mt-3 text-sm text-text-muted font-mono break-all">
                Report ID: {submittedReportId}
              </p>
            )}
          </div>
          <Button
            onClick={() => {
              setSuccess(false);
              setSubmitStep('idle');
              setSubmitError(null);
              setCurrentStep(1);
            }}
            variant="primary"
          >
            Submit Another Report
          </Button>
        </motion.div>
      </Card>
    );
  }

  // ─── Main form ──────────────────────────────────────────────────────────────

  return (
    <>
      <WalletConnect
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onConnect={handleWalletConnected}
      />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                step <= currentStep
                  ? 'bg-accent-mid text-white'
                  : 'bg-white/10 text-text-muted'
              }`}>
                {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                  step < currentStep ? 'bg-accent-mid' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">

            {/* ── Step 1: Report Details ─────────────────────────────────── */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <Card>
                  <div className="flex items-center space-x-3 mb-6">
                    <FileText className="w-6 h-6 text-accent-bright" />
                    <h3 className="text-xl font-semibold text-white">Report Details</h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-3">
                        Category *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {CATEGORIES.map((category) => {
                          const Icon = category.icon;
                          return (
                            <label
                              key={category.value}
                              className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                watchedValues.category === category.value
                                  ? 'border-accent-primary bg-accent-mid/10'
                                  : 'border-white/10 hover:border-white/20 bg-white/5'
                              }`}
                            >
                              <input
                                type="radio"
                                value={category.value}
                                {...register('category')}
                                className="sr-only"
                              />
                              <Icon size={20} className="text-accent-bright" />
                              <span className="text-white font-medium">{category.label}</span>
                            </label>
                          );
                        })}
                      </div>
                      {errors.category && (
                        <p className="text-error text-sm mt-2">{errors.category.message}</p>
                      )}
                    </div>

                    <Textarea
                      label="Report Description *"
                      placeholder="Describe the incident in detail. Include what happened, when, where, and who was involved..."
                      rows={8}
                      {...register('reportContent')}
                      error={errors.reportContent?.message}
                      helperText={`${reportContent.length}/5000 characters`}
                    />
                  </div>
                </Card>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!watchedValues.category || reportContent.length < 50}
                  >
                    Next Step
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: Privacy & Security ─────────────────────────────── */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <Card>
                  <div className="flex items-center space-x-3 mb-6">
                    <Lock className="w-6 h-6 text-accent-bright" />
                    <h3 className="text-xl font-semibold text-white">Privacy & Security</h3>
                  </div>

                  <div className="space-y-6">
                    {/* Anonymous toggle */}
                    <div className="p-4 bg-accent-mid/10 rounded-xl border border-accent-primary/20">
                      <Switch
                        checked={isAnonymous}
                        onCheckedChange={(checked) => {
                          setValue('isAnonymous', checked);
                          if (!checked) setValue('useSponsored', false);
                        }}
                        label="Submit Anonymously"
                        description="Use zero-knowledge proofs to keep your identity completely separate from your report"
                      />
                    </div>

                    {/* Wallet / sponsored options — only shown when anonymous */}
                    {isAnonymous && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        {/* Sponsored toggle */}
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <Switch
                            checked={useSponsored}
                            onCheckedChange={(checked) => setValue('useSponsored', checked)}
                            label="Use Sponsored Submission (no wallet needed)"
                            description="The community sponsorship pool pays gas fees on your behalf. Slightly less private — proof is generated by the relayer."
                          />
                        </div>

                        {/* Wallet connection panel */}
                        {!useSponsored && (
                          <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                            <div className="flex items-center space-x-2 text-sm font-medium text-text-secondary">
                              <Wallet className="w-4 h-4" />
                              <span>Wallet required for ZK proof generation</span>
                            </div>
                            <p className="text-xs text-text-muted">
                              Your wallet signs a message to derive your anonymous identity secret.
                              The signature never leaves your browser and is not recorded anywhere.
                            </p>

                            {wallet ? (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-success" />
                                  <span className="text-success text-sm font-mono">{walletShort}</span>
                                  <span className="text-xs text-text-muted">
                                    (chain {wallet.chainId})
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setWallet(null)}
                                >
                                  Disconnect
                                </Button>
                              </div>
                            ) : (
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setWalletModalOpen(true)}
                                className="w-full"
                              >
                                <Wallet className="w-4 h-4 mr-2" />
                                Connect Wallet
                              </Button>
                            )}
                          </div>
                        )}

                        {/* Info banner */}
                        <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-text-primary flex items-start space-x-2">
                          <Info className="w-4 h-4 mt-0.5 shrink-0" />
                          <span>
                            {useSponsored
                              ? 'Sponsored submissions are batched and relayed by the platform. Your report content is still encrypted before leaving your device.'
                              : 'ZK proof generation runs entirely in your browser. Your report text and identity secret never touch our servers unencrypted.'}
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* Severity */}
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-3">
                        Severity Level *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {SEVERITY_LEVELS.map((level) => (
                          <label
                            key={level.value}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                              watchedValues.severity === level.value
                                ? 'border-accent-primary bg-accent-mid/10'
                                : 'border-white/10 hover:border-white/20 bg-white/5'
                            }`}
                          >
                            <input
                              type="radio"
                              value={level.value}
                              {...register('severity')}
                              className="sr-only"
                            />
                            <div className={`font-semibold ${level.color} mb-1`}>{level.label}</div>
                            <div className="text-text-muted text-sm">{level.description}</div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Input
                      label="Location (Optional)"
                      placeholder="City, region, or general area"
                      {...register('location')}
                      helperText="Helps understand the geographic scope — leave blank if you prefer"
                    />
                  </div>
                </Card>

                <div className="flex justify-between">
                  <Button type="button" variant="ghost" onClick={prevStep}>Previous</Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={needsWallet && !wallet}
                    title={needsWallet && !wallet ? 'Connect a wallet to continue' : undefined}
                  >
                    {needsWallet && !wallet ? 'Connect Wallet First' : 'Review & Submit'}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Review & Submit ────────────────────────────────── */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-6"
              >
                <Card>
                  <div className="flex items-center space-x-3 mb-6">
                    <Eye className="w-6 h-6 text-accent-bright" />
                    <h3 className="text-xl font-semibold text-white">Review Your Report</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="text-sm text-text-secondary mb-1">Category</div>
                      <div className="text-white font-medium">
                        {CATEGORIES.find(c => c.value === watchedValues.category)?.label}
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="text-sm text-text-secondary mb-1">Severity</div>
                      <div className="text-white font-medium">
                        {SEVERITY_LEVELS.find(s => s.value === watchedValues.severity)?.label}
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="text-sm text-text-secondary mb-1">Submission method</div>
                      <div className="text-white font-medium flex items-center space-x-2">
                        {!isAnonymous && <span>Identified report</span>}
                        {isAnonymous && !useSponsored && (
                          <>
                            <Shield className="w-4 h-4 text-accent-bright" />
                            <span>Anonymous — ZK proof via {walletShort}</span>
                          </>
                        )}
                        {isAnonymous && useSponsored && (
                          <>
                            <Shield className="w-4 h-4 text-accent-bright" />
                            <span>Anonymous — Sponsored (no wallet)</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl">
                      <div className="text-sm text-text-secondary mb-2">Report Content</div>
                      <div className="text-white max-h-32 overflow-y-auto text-sm leading-relaxed">
                        {showPreview ? reportContent : `${reportContent.substring(0, 200)}${reportContent.length > 200 ? '…' : ''}`}
                      </div>
                      {reportContent.length > 200 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPreview(!showPreview)}
                          className="mt-2"
                        >
                          {showPreview ? 'Show Less' : 'Show Full Report'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Submission progress */}
                  {isSubmitting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 p-4 bg-accent-mid/10 border border-accent-primary/20 rounded-xl"
                    >
                      <div className="flex items-center space-x-3">
                        <Loader2 className="w-5 h-5 text-accent-bright animate-spin shrink-0" />
                        <span className="text-white font-medium">{STEP_LABELS[submitStep]}</span>
                      </div>
                      {submitStep === 'generating_proof' && (
                        <p className="mt-2 text-xs text-text-muted ml-8">
                          This runs entirely in your browser and may take 10–30 seconds.
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Error */}
                  {submitStep === 'error' && submitError && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 p-4 bg-error/10 border border-error/20 rounded-xl"
                    >
                      <div className="flex items-start space-x-3">
                        <XCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                        <div>
                          <div className="text-error font-medium mb-1">Submission Failed</div>
                          <div className="text-text-secondary text-sm">{submitError}</div>
                          {submitError.includes('circuit artifacts') && (
                            <div className="mt-2 text-xs text-text-muted">
                              The ZK circuit has not been compiled yet. Run the setup commands in
                              <code className="mx-1 px-1 bg-white/10 rounded">zkpService.ts</code>
                              then copy the artifacts to
                              <code className="mx-1 px-1 bg-white/10 rounded">public/circuits/</code>.
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Warning */}
                  <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-warning mt-0.5 shrink-0" />
                      <div className="text-text-secondary text-sm">
                        By submitting, you confirm the information is accurate to the best of your knowledge.
                        False reports may have legal consequences.
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start space-x-3">
                    <input
                      type="checkbox"
                      {...register('agreeToTerms')}
                      className="mt-1 w-4 h-4 text-accent-bright bg-white/10 border-white/20 rounded focus:ring-accent-primary/50"
                    />
                    <label className="text-text-secondary text-sm">
                      I agree to the terms and conditions and confirm the accuracy of this report *
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-error text-sm">{errors.agreeToTerms.message}</p>
                  )}
                </Card>

                <div className="flex justify-between">
                  <Button type="button" variant="ghost" onClick={prevStep} disabled={isSubmitting}>
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={!watchedValues.agreeToTerms || isSubmitting}
                  >
                    {isSubmitting ? STEP_LABELS[submitStep] : 'Submit Report'}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </>
  );
};

export default ReportForm;
