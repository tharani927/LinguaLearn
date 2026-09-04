import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gamificationApi } from '../../services/api';
import CertificateModal from '../../components/CertificateModal';
import { Award, Eye, Download, BookOpen } from 'lucide-react';

const CertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await gamificationApi.getCertificates();
        setCertificates(data);
      } catch (err) {
        console.error('Failed to load certificates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-500">Loading certificate records...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
          Accreditation &amp; Completion
        </span>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
          Course Completion Certificates
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Cryptographically verified certificates earned by completing 100% of curriculum lessons
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <Award className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Certificates Earned Yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Complete all lessons in any course to unlock your verified LinguaLearn Certificate of Fluency!
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Courses</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-brand-600">
                    {cert.certificate_code}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {cert.course_title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Issued to: <span className="font-semibold text-slate-700 dark:text-slate-300">{cert.learner_name}</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Issued Date: {new Date(cert.issued_at).toLocaleDateString()}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600">100% Completed</span>
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View / Print</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCert && (
        <CertificateModal certificate={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
    </div>
  );
};

export default CertificatesPage;
