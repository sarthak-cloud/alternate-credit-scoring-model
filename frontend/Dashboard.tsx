import React, { useState } from 'react';
import { Calculator, TrendingUp, AlertCircle, CheckCircle, DollarSign, Briefcase, Home, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  age: string;
  gender: string;
  educationQualification: string;
  monthlyIncome: string;
  monthlyExpenditure: string;
  employmentStatus: string;
  employmentDuration: string;
  rentPaymentHistory: string;
  utilityPaymentHistory: string;
  savingsAmount: string;
  debtToIncome: string;
}

interface ScoreResult {
  score: number;
  riskCategory: 'low' | 'medium' | 'high';
  approved: boolean;
  advice: string[];
  factors: {
    income: number;
    employment: number;
    paymentHistory: number;
    savings: number;
    debtRatio: number;
  };
}

const Dashboard: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    gender: '',
    educationQualification: '',
    monthlyIncome: '',
    monthlyExpenditure: '',
    employmentStatus: '',
    employmentDuration: '',
    rentPaymentHistory: '',
    utilityPaymentHistory: '',
    savingsAmount: '',
    debtToIncome: ''
  });

  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateScore = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock scoring algorithm
    const income = parseFloat(formData.monthlyIncome) || 0;
    const expenses = parseFloat(formData.monthlyExpenditure) || 0;
    const savings = parseFloat(formData.savingsAmount) || 0;
    const debtRatio = parseFloat(formData.debtToIncome) || 0;
    
    let score = 600; // Base score
    
    // Age factor (0-25 points)
    const age = parseInt(formData.age) || 0;
    if (age >= 25 && age <= 65) score += 25;
    else if (age >= 18 && age < 25) score += 15;
    else if (age > 65) score += 20;
    
    // Education factor (0-50 points)
    if (formData.educationQualification === 'postgraduate') score += 50;
    else if (formData.educationQualification === 'graduate') score += 40;
    else if (formData.educationQualification === 'diploma') score += 30;
    else if (formData.educationQualification === 'high-school') score += 20;
    else if (formData.educationQualification === 'below-high-school') score += 10;
    
    // Income factor (0-150 points)
    if (income > 0) {
      score += Math.min(income / 1000 * 10, 150);
    }
    
    // Expense ratio factor (-100 to +50 points)
    if (income > 0 && expenses > 0) {
      const expenseRatio = expenses / income;
      if (expenseRatio < 0.3) score += 50;
      else if (expenseRatio < 0.5) score += 25;
      else if (expenseRatio < 0.7) score += 0;
      else score -= 50;
    }
    
    // Employment factor (0-100 points)
    if (formData.employmentStatus === 'full-time') score += 100;
    else if (formData.employmentStatus === 'part-time') score += 50;
    else if (formData.employmentStatus === 'self-employed') score += 75;
    else if (formData.employmentStatus === 'contract') score += 60;
    
    // Employment duration factor (0-50 points)
    if (formData.employmentDuration === '2+') score += 50;
    else if (formData.employmentDuration === '1-2') score += 35;
    else if (formData.employmentDuration === '6-12') score += 20;
    
    // Payment history factor (0-100 points)
    if (formData.rentPaymentHistory === 'excellent') score += 100;
    else if (formData.rentPaymentHistory === 'good') score += 75;
    else if (formData.rentPaymentHistory === 'fair') score += 25;
    
    // Utility payments (0-50 points)
    if (formData.utilityPaymentHistory === 'excellent') score += 50;
    else if (formData.utilityPaymentHistory === 'good') score += 35;
    else if (formData.utilityPaymentHistory === 'fair') score += 15;
    
    // Savings factor (0-50 points)
    if (savings > income * 3) score += 50;
    else if (savings > income * 1) score += 30;
    else if (savings > income * 0.5) score += 15;
    
    // Debt to income factor (-100 to +25 points)
    if (debtRatio < 20) score += 25;
    else if (debtRatio < 36) score += 0;
    else if (debtRatio < 50) score -= 25;
    else score -= 75;
    
    // Cap the score between 300-850
    score = Math.max(300, Math.min(850, Math.round(score)));
    
    // Determine risk category and approval
    let riskCategory: 'low' | 'medium' | 'high';
    let approved: boolean;
    
    if (score >= 700) {
      riskCategory = 'low';
      approved = true;
    } else if (score >= 600) {
      riskCategory = 'medium';
      approved = true;
    } else {
      riskCategory = 'high';
      approved = false;
    }
    
    // Generate personalized advice
    const advice: string[] = [];
    if (expenses / income > 0.7) advice.push("Consider reducing monthly expenses to improve your debt-to-income ratio");
    if (formData.employmentDuration === '<6') advice.push("Building longer employment history will positively impact your score");
    if (formData.rentPaymentHistory === 'fair' || formData.rentPaymentHistory === 'poor') advice.push("Focus on making all rent payments on time moving forward");
    if (savings < income) advice.push("Building an emergency fund shows financial stability to lenders");
    if (debtRatio > 36) advice.push("Work on paying down existing debt to improve your approval chances");
    
    if (advice.length === 0) {
      advice.push("Great job! Your financial profile shows strong creditworthiness");
    }
    
    const mockResult: ScoreResult = {
      score,
      riskCategory,
      approved,
      advice,
      factors: {
        income: Math.min(100, (income / 5000) * 100),
        employment: formData.employmentStatus === 'full-time' ? 95 : formData.employmentStatus === 'part-time' ? 70 : 80,
        paymentHistory: formData.rentPaymentHistory === 'excellent' ? 95 : formData.rentPaymentHistory === 'good' ? 80 : 60,
        savings: Math.min(100, (savings / (income * 3)) * 100),
        debtRatio: Math.max(0, 100 - debtRatio * 2)
      }
    };
    
    setResult(mockResult);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateScore();
  };

  return (
    <div className="px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4">
            Alternative Credit Score Calculator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Tell us about your financial situation and we'll calculate your alternative credit score
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-600 pb-2">
                  Personal Information
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                      <span>Age</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="30"
                      min="18"
                      max="100"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                      <span>Gender</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                      <span>Education Qualification</span>
                    </label>
                    <select
                      name="educationQualification"
                      value={formData.educationQualification}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select qualification</option>
                      <option value="below-high-school">Below High School</option>
                      <option value="high-school">High School</option>
                      <option value="diploma">Diploma</option>
                      <option value="graduate">Graduate</option>
                      <option value="postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Income & Expenses */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-600 pb-2">
                  Financial Information
                </h3>
                
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Monthly Earning</span>
                  </label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="5000"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Monthly Expenditure</span>
                  </label>
                  <input
                    type="number"
                    name="monthlyExpenditure"
                    value={formData.monthlyExpenditure}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="3000"
                    required
                  />
                </div>
              </div>
              </div>

              {/* Employment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-600 pb-2">
                  Employment Details
                </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                    <Briefcase className="w-4 h-4" />
                    <span>Employment Status</span>
                  </label>
                  <select
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select status</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="self-employed">Self-employed</option>
                    <option value="contract">Contract</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Employment Duration</span>
                  </label>
                  <select
                    name="employmentDuration"
                    value={formData.employmentDuration}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select duration</option>
                    <option value="<6">Less than 6 months</option>
                    <option value="6-12">6-12 months</option>
                    <option value="1-2">1-2 years</option>
                    <option value="2+">2+ years</option>
                  </select>
                </div>
              </div>
              </div>

              {/* Payment History */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-600 pb-2">
                  Payment History
                </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                    <Home className="w-4 h-4" />
                    <span>Rent Payment History</span>
                  </label>
                  <select
                    name="rentPaymentHistory"
                    value={formData.rentPaymentHistory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select history</option>
                    <option value="excellent">Excellent (100% on-time)</option>
                    <option value="good">Good (90%+ on-time)</option>
                    <option value="fair">Fair (80%+ on-time)</option>
                    <option value="poor">Poor (&lt;80% on-time)</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                    <Zap className="w-4 h-4" />
                    <span>Utility Payment History</span>
                  </label>
                  <select
                    name="utilityPaymentHistory"
                    value={formData.utilityPaymentHistory}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select history</option>
                    <option value="excellent">Excellent (100% on-time)</option>
                    <option value="good">Good (90%+ on-time)</option>
                    <option value="fair">Fair (80%+ on-time)</option>
                    <option value="poor">Poor (&lt;80% on-time)</option>
                  </select>
                </div>
              </div>
              </div>

              {/* Savings & Debt */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-600 pb-2">
                  Financial Assets & Liabilities
                </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Savings Amount</span>
                  </label>
                  <input
                    type="number"
                    name="savingsAmount"
                    value={formData.savingsAmount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 font-medium mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Debt-to-Income Ratio (%)</span>
                  </label>
                  <input
                    type="number"
                    name="debtToIncome"
                    value={formData.debtToIncome}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="30"
                    max="100"
                  />
                </div>
              </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-300 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Calculating...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    <span>Calculate My Score</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-slate-700/20"
          >
            {!result ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <Calculator className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Your Score Will Appear Here
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500">
                    Fill out the form and click "Calculate My Score" to see your alternative credit score and loan approval decision.
                  </p>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Score Display */}
                <div className="text-center">
                  <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-white font-bold text-3xl ${
                    result.riskCategory === 'low' ? 'bg-gradient-to-r from-green-500 to-green-400' :
                    result.riskCategory === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                    'bg-gradient-to-r from-red-500 to-red-400'
                  }`}>
                    {result.score}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-4 mb-2">
                    Your Alternative Credit Score
                  </h3>
                  <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
                    result.riskCategory === 'low' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                    result.riskCategory === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                    'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {result.approved ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span>
                      {result.approved ? 'Likely Approved' : 'May Need Improvement'}
                    </span>
                  </div>
                </div>

                {/* Risk Category */}
                <div className="text-center p-4 bg-white/50 dark:bg-slate-700/50 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Risk Category</p>
                  <p className={`text-lg font-semibold capitalize ${
                    result.riskCategory === 'low' ? 'text-green-600 dark:text-green-400' :
                    result.riskCategory === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {result.riskCategory} Risk
                  </p>
                </div>

                {/* Advice */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                    Personalized Advice
                  </h4>
                  <div className="space-y-3">
                    {result.advice.map((advice, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-700 dark:text-slate-300">{advice}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;