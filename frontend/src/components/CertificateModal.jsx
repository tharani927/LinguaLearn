import React, { useState } from 'react';
import { Award, Download, Printer, X, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const CertificateModal = ({ certificate, onClose }) => {
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(certificate.certificate_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Certificate Canvas */}
        <div id="printable-certificate" className="p-8 rounded-2xl border-4 border-brand-500/30 bg-gradient-to-br from-amber-50/40 via-white to-brand-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-brand-950/40 text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-500/10 blur-xl pointer-events-none" />
          
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 mb-4">
            <Award className="w-8 h-8" />
          </div>

          <h3 className="text-xs font-bold tracking-widest uppercase text-brand-600 dark:text-brand-400">
            Certificate of Fluency Achievement
          </h3>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            LinguaLearn Verified Completion
          </h1>
          
          <p className="text-xs text-slate-500 mt-4">This hereby certifies that</p>
          <p className="text-xl sm:text-2xl font-black text-brand-700 dark:text-brand-300 underline decoration-brand-400 underline-offset-8 mt-1">
            {certificate.learner_name}
          </p>

          <p className="text-xs text-slate-500 mt-4">
            has successfully mastered and fulfilled the curricular requirements for
          </p>
          <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
            {certificate.course_title}
          </p>

          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div>
              <span className="font-semibold text-slate-600 dark:text-slate-300">Issued Date: </span>
              {new Date(certificate.issued_at).toLocaleDateString()}
            </div>
            <div>
              <span className="font-semibold text-slate-600 dark:text-slate-300">Certificate ID: </span>
              <span className="font-mono text-brand-600 dark:text-brand-400">{certificate.certificate_code}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Award className="w-4 h-4" />}
            {copied ? 'Copied Code!' : 'Copy Verification Code'}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md shadow-brand-500/20"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;
