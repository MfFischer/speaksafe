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
  Lock
} from 'lucide-react';
import { Button, Card, Input, Textarea, Switch } from './ui';
import apiService from '../services/apiService';
import web3Service from '../services/web3Service';
import zkpService from '../services/zkpService';

// Form validation schema
const reportSchema = z.object({
  reportContent: z.string()
    .min(50, 'Report must be at least 50 characters long')
    .max(5000, 'Report cannot exceed 5000 characters'),
  category: z.string().min(1, 'Please select a category'),
  severity: z.string(),
  location: z.string().optional(),
  isAnonymous: z.boolean(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms')
});

type ReportFormData = z.infer<typeof reportSchema>;

const ReportForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      isAnonymous: true,
      severity: 'medium',
      agreeToTerms: false
    }
  });

  const watchedValues = watch();
  const reportContent = watch('reportContent') || '';
  const isAnonymous = watch('isAnonymous');

  const categories = [
    { value: 'corruption', label: 'Corruption', icon: AlertTriangle },
    { value: 'misconduct', label: 'Police Misconduct', icon: Shield },
    { value: 'environmental', label: 'Environmental Violation', icon: FileText },
    { value: 'fraud', label: 'Financial Fraud', icon: AlertTriangle },
    { value: 'discrimination', label: 'Discrimination', icon: AlertTriangle },
    { value: 'other', label: 'Other', icon: FileText }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'text-green-400', description: 'Minor issue' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400', description: 'Moderate concern' },
    { value: 'high', label: 'High', color: 'text-orange-400', description: 'Serious issue' },
    { value: 'critical', label: 'Critical', color: 'text-red-400', description: 'Urgent action needed' }
  ];

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);

    try {
      // Generate hash of report for blockchain
      const reportHash = await web3Service.generateReportHash(data.reportContent);

      // If anonymous, generate ZK proof
      let proof = null;
      if (data.isAnonymous) {
        proof = await zkpService.generateProof(data.reportContent);
      }

      // Encrypt report content
      const encryptedContent = await web3Service.encryptData(data.reportContent);

      // Submit to API
      await apiService.submitReport(encryptedContent, reportHash);

      // Store hash on blockchain
      await web3Service.storeReportHash(reportHash, proof);

      setSuccess(true);
    } catch (err) {
      console.error('Failed to submit report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

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
              Your report has been encrypted and stored securely on the blockchain.
              {isAnonymous && ' Your identity remains completely anonymous.'}
            </p>
          </div>
          <Button onClick={() => setSuccess(false)} variant="primary">
            Submit Another Report
          </Button>
        </motion.div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
              step <= currentStep
                ? 'bg-accent-primary text-white'
                : 'bg-white/10 text-text-muted'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                step < currentStep ? 'bg-accent-primary' : 'bg-white/10'
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Report Details */}
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
                  <FileText className="w-6 h-6 text-accent-primary" />
                  <h3 className="text-xl font-semibold text-white">Report Details</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      Category *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <label
                            key={category.value}
                            className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                              watchedValues.category === category.value
                                ? 'border-accent-primary bg-accent-primary/10'
                                : 'border-white/10 hover:border-white/20 bg-white/5'
                            }`}
                          >
                            <input
                              type="radio"
                              value={category.value}
                              {...register('category')}
                              className="sr-only"
                            />
                            <Icon size={20} className="text-accent-primary" />
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
                  disabled={!watchedValues.category || !reportContent || reportContent.length < 50}
                >
                  Next Step
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Privacy & Security */}
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
                  <Lock className="w-6 h-6 text-accent-primary" />
                  <h3 className="text-xl font-semibold text-white">Privacy & Security Settings</h3>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-accent-primary/10 rounded-xl border border-accent-primary/20">
                    <Switch
                      checked={isAnonymous}
                      onCheckedChange={(checked) => setValue('isAnonymous', checked)}
                      label="Submit Anonymously"
                      description="Use zero-knowledge proofs to protect your identity while maintaining report integrity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-3">
                      Severity Level *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {severityLevels.map((level) => (
                        <label
                          key={level.value}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center ${
                            watchedValues.severity === level.value
                              ? 'border-accent-primary bg-accent-primary/10'
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
                    helperText="This helps authorities understand the scope of the issue"
                  />
                </div>
              </Card>

              <div className="flex justify-between">
                <Button type="button" variant="ghost" onClick={prevStep}>
                  Previous
                </Button>
                <Button type="button" onClick={nextStep}>
                  Review & Submit
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review & Submit */}
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
                  <Eye className="w-6 h-6 text-accent-primary" />
                  <h3 className="text-xl font-semibold text-white">Review Your Report</h3>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-sm text-text-secondary mb-2">Category</div>
                    <div className="text-white font-medium">
                      {categories.find(c => c.value === watchedValues.category)?.label}
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-sm text-text-secondary mb-2">Severity</div>
                    <div className="text-white font-medium">
                      {severityLevels.find(s => s.value === watchedValues.severity)?.label}
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-sm text-text-secondary mb-2">Privacy</div>
                    <div className="text-white font-medium">
                      {isAnonymous ? 'Anonymous (Zero-Knowledge Proof)' : 'Identified Report'}
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="text-sm text-text-secondary mb-2">Report Content</div>
                    <div className="text-white max-h-32 overflow-y-auto">
                      {showPreview ? reportContent : `${reportContent.substring(0, 200)}...`}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                      className="mt-2"
                    >
                      {showPreview ? 'Show Less' : 'Show Full Report'}
                    </Button>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-warning mt-0.5" />
                    <div>
                      <div className="text-warning font-medium mb-1">Important Notice</div>
                      <div className="text-text-secondary text-sm">
                        By submitting this report, you confirm that the information provided is accurate to the best of your knowledge.
                        False reports may have legal consequences.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register('agreeToTerms')}
                    className="w-4 h-4 text-accent-primary bg-white/10 border-white/20 rounded focus:ring-accent-primary/50"
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
                <Button type="button" variant="ghost" onClick={prevStep}>
                  Previous
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={!watchedValues.agreeToTerms}
                >
                  {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default ReportForm;