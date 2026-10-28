import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePlotNest } from '../context/PlotNestContext';
import { mockProjects } from '../data/mockData';
import {
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Download,
  RotateCcw,
  Shield,
  Layers,
} from 'lucide-react';

interface RawRow {
  id: number;
  name: string;
  phone: string;
  city: string;
  project: string;
  budget: number;
  source: string;
  status: 'valid' | 'duplicate' | 'error';
  errorMessage?: string;
}

export const ExcelImportPage: React.FC = () => {
  const { leads, importLeads, language, showToast } = usePlotNest();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [fileName, setFileName] = useState<string>('meta_ads_leads_oct_2026.xlsx');
  const [selectedFileLoaded, setSelectedFileLoaded] = useState(false);

  // Column mapping state
  const [columnMap, setColumnMap] = useState({
    name: 'Full Name',
    phone: 'Contact Number',
    city: 'City / Location',
    project: 'Preferred Farm Project',
    budget: 'Budget (INR)',
    source: 'Campaign Source',
  });

  // Mock parsed raw data from Excel file
  const [parsedRows, setParsedRows] = useState<RawRow[]>([
    {
      id: 1,
      name: 'Aditya Birla Chemicals Director',
      phone: '+91 98201 44551', // Duplicate with lead-101
      city: 'Mumbai',
      project: 'Green Acres Valley',
      budget: 35,
      source: 'meta_ads',
      status: 'duplicate',
      errorMessage: 'Phone number already exists in CRM (Duplicate skip)',
    },
    {
      id: 2,
      name: 'Sudhir & Meera Kothari',
      phone: '+91 98450 33882',
      city: 'Bengaluru',
      project: 'Green Acres Valley',
      budget: 40,
      source: 'meta_ads',
      status: 'valid',
    },
    {
      id: 3,
      name: 'Dr. Hemant Deshpande',
      phone: '+91 98222 77119',
      city: 'Pune',
      project: 'Vedic Farms & Orchards',
      budget: 25,
      source: 'google',
      status: 'valid',
    },
    {
      id: 4,
      name: 'Unknown User #491',
      phone: 'N/A', // Error row
      city: 'Hyderabad',
      project: 'Sahyadri Agro Haven',
      budget: 30,
      source: 'meta_ads',
      status: 'error',
      errorMessage: 'Missing valid 10-digit mobile number',
    },
    {
      id: 5,
      name: 'Bhawna Swaminathan',
      phone: '+91 98801 55223',
      city: 'Chennai',
      project: 'Green Acres Valley',
      budget: 32,
      source: 'referral',
      status: 'valid',
    },
  ]);

  const [importSummary, setImportSummary] = useState<{
    imported: number;
    duplicatesSkipped: number;
    errors: number;
  } | null>(null);

  const handleDownloadSampleCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Full Name,Contact Number,City / Location,Preferred Farm Project,Budget (INR),Campaign Source\n' +
      'Ramesh Gupta,+91 98200 11223,Bengaluru,Green Acres Valley,30,meta_ads\n' +
      'Sunita Rao,+91 98450 88992,Hyderabad,Vedic Farms,25,google\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'plotnest_sample_leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Download Started', 'Sample CSV downloaded to your device.', 'info');
  };

  const handleExecuteImport = () => {
    const validRowsToImport = parsedRows
      .filter((r) => r.status === 'valid')
      .map((r) => ({
        name: r.name,
        phone: r.phone,
        city: r.city,
        source: 'meta_ads' as const,
        budgetInLakhs: r.budget,
        interestedProjectId: 'proj-1',
        interestedProjectName: r.project,
      }));

    const result = importLeads(validRowsToImport);
    setImportSummary({
      imported: result.imported,
      duplicatesSkipped: parsedRows.filter((r) => r.status === 'duplicate').length + result.duplicatesSkipped,
      errors: parsedRows.filter((r) => r.status === 'error').length + result.errors,
    });
    setStep(4);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5 text-[#14532D]" />
            <span>Admin Bulk Data Utilities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {language === 'hi' ? 'एक्सेल लीड्स आयात विज़ार्ड' : 'Excel / CSV Lead Import Wizard'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {language === 'hi'
              ? '4-चरणीय विज़ार्ड: अपलोड, कॉलम मैपिंग, त्रुटि और डुप्लिकेट सत्यापन, एवं सीआरएम में आयात'
              : 'Bulk ingest lead spreadsheets with duplicate phone verification and field mapping'}
          </p>
        </div>

        <button
          onClick={handleDownloadSampleCSV}
          className="touch-target px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-2 shadow-xs"
        >
          <Download className="w-4 h-4 text-emerald-700" />
          <span>Download Sample CSV</span>
        </button>
      </div>

      {/* Stepper Header (4 steps) */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5DFD5] shadow-xs">
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          {[
            { num: 1, title: 'Upload File' },
            { num: 2, title: 'Map Columns' },
            { num: 3, title: 'Validate Preview' },
            { num: 4, title: 'Done' },
          ].map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm mb-1.5 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#14532D] text-white ring-4 ring-emerald-100'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span
                  className={`text-xs font-bold truncate max-w-full ${
                    isCurrent ? 'text-[#14532D]' : 'text-gray-500'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: UPLOAD SPREADSHEET */}
      {step === 1 && (
        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-sm space-y-6 animate-in fade-in">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#FAF8F5] border-2 border-dashed border-[#14532D]/40 text-[#14532D] flex items-center justify-center mx-auto">
              <UploadCloud className="w-8 h-8 text-emerald-700" />
            </div>

            <div>
              <h3 className="text-xl font-black text-gray-900">
                Choose or Drop Spreadsheet (.xlsx, .csv)
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Upload campaign exports from Meta Ads, Google Ads, or property exhibitions.
              </p>
            </div>

            <div
              onClick={() => setSelectedFileLoaded(true)}
              className={`p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
                selectedFileLoaded
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-gray-300 hover:border-[#14532D] bg-[#FAF8F5]'
              }`}
            >
              <FileSpreadsheet className="w-8 h-8 text-emerald-800 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-800">{fileName}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedFileLoaded
                  ? 'File parsed (5 prospective leads detected)'
                  : 'Click to select sample file from workspace'}
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => setSelectedFileLoaded(true)}
                className="touch-target px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700"
              >
                Load Sample Spreadsheet
              </button>
              <button
                disabled={!selectedFileLoaded}
                onClick={() => setStep(2)}
                className={`touch-target px-6 py-2.5 rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-sm ${
                  selectedFileLoaded
                    ? 'bg-[#14532D] hover:bg-[#166534] text-white cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span>Continue to Column Mapping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: MAP COLUMNS */}
      {step === 2 && (
        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-sm space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-xl font-black text-gray-900">
              Map Spreadsheet Columns to CRM Lead Fields
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Confirm source spreadsheet headers correspond correctly to target CRM entities.
            </p>
          </div>

          <div className="max-w-2xl space-y-3">
            {[
              { field: 'name', label: 'Prospect Full Name *', defaultCol: 'Full Name' },
              { field: 'phone', label: 'Phone Number (10 Digits) *', defaultCol: 'Contact Number' },
              { field: 'city', label: 'City / Location', defaultCol: 'City / Location' },
              { field: 'project', label: 'Interested Farm Project', defaultCol: 'Preferred Farm Project' },
              { field: 'budget', label: 'Budget in INR', defaultCol: 'Budget (INR)' },
              { field: 'source', label: 'Campaign Source', defaultCol: 'Campaign Source' },
            ].map((col) => (
              <div
                key={col.field}
                className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="font-bold text-xs text-gray-900">{col.label}</span>
                  <p className="text-[10px] text-gray-500">CRM Entity: {col.field}</p>
                </div>

                <select
                  value={(columnMap as any)[col.field]}
                  onChange={(e) =>
                    setColumnMap({ ...columnMap, [col.field]: e.target.value })
                  }
                  className="px-3 py-1.5 rounded-xl border border-gray-300 bg-white text-xs font-semibold text-gray-800"
                >
                  <option value={col.defaultCol}>{col.defaultCol} (Detected)</option>
                  <option value="Column A">Column A</option>
                  <option value="Column B">Column B</option>
                  <option value="Ignore">-- Ignore Field --</option>
                </select>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="touch-target px-4 py-2.5 rounded-xl border text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="touch-target px-6 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-sm font-extrabold flex items-center gap-2 shadow-sm"
            >
              <span>Validate & Review Preview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: VALIDATE PREVIEW & ERROR ROW REPORT */}
      {step === 3 && (
        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-sm space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-gray-900">
                Validation Preview & Duplicate Report
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Parsed 5 candidate rows. 3 ready to import, 1 existing phone duplicate, 1 row error.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                3 Valid
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                1 Duplicate
              </span>
              <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">
                1 Error
              </span>
            </div>
          </div>

          {/* Row-error Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-gray-700 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Prospect Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Project</th>
                  <th className="p-3">Budget</th>
                  <th className="p-3">Validation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {parsedRows.map((row) => (
                  <tr
                    key={row.id}
                    className={
                      row.status === 'duplicate'
                        ? 'bg-amber-50/50'
                        : row.status === 'error'
                        ? 'bg-rose-50/50'
                        : 'hover:bg-gray-50'
                    }
                  >
                    <td className="p-3 text-gray-400 font-mono">{row.id}</td>
                    <td className="p-3 font-bold text-gray-900">{row.name}</td>
                    <td className="p-3 font-mono">{row.phone}</td>
                    <td className="p-3 text-emerald-800 font-medium">{row.project}</td>
                    <td className="p-3 font-bold text-gray-900">₹{row.budget} Lakh</td>
                    <td className="p-3">
                      {row.status === 'valid' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Valid Row</span>
                        </span>
                      ) : row.status === 'duplicate' ? (
                        <span className="inline-flex items-center gap-1 text-amber-900 font-bold" title={row.errorMessage}>
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Duplicate Phone (Skip)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-bold" title={row.errorMessage}>
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Invalid Data (Skip)</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE4D9] text-xs text-gray-600 space-y-1">
            <p className="font-bold text-gray-900">Import Policy Notice:</p>
            <p>
              Row #1 (+91 98201 44551) matches an existing lead in the CRM and will be skipped to
              prevent accidental duplicate record creation. Row #4 has missing telephone digits.
              Only the 3 verified rows will be written to the database.
            </p>
          </div>

          <div className="pt-2 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="touch-target px-4 py-2.5 rounded-xl border text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleExecuteImport}
              className="touch-target px-6 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-sm font-extrabold flex items-center gap-2 shadow-sm"
            >
              <FileCheck className="w-4 h-4 text-emerald-300" />
              <span>Import 3 Valid Leads Now</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: IMPORT COMPLETED */}
      {step === 4 && importSummary && (
        <div className="p-8 rounded-3xl bg-white border border-[#E5DFD5] shadow-sm text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#14532D] flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10 text-emerald-700" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-gray-900">
              Bulk Lead Import Completed Successfully!
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Records ingested and added to the CRM unassigned queue for moderator assignment.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-center">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-xs font-bold text-emerald-800 uppercase block">Imported</span>
              <span className="text-2xl font-black text-[#14532D] mt-1 block">
                {importSummary.imported}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-xs font-bold text-amber-800 uppercase block">Duplicates</span>
              <span className="text-2xl font-black text-amber-900 mt-1 block">
                {importSummary.duplicatesSkipped}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="text-xs font-bold text-rose-800 uppercase block">Errors Skipped</span>
              <span className="text-2xl font-black text-rose-900 mt-1 block">
                {importSummary.errors}
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setStep(1);
                setSelectedFileLoaded(false);
              }}
              className="touch-target px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Import Another File
            </button>
            <Link
              to="/leads"
              className="touch-target px-6 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <span>View Ingested Leads in CRM</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
