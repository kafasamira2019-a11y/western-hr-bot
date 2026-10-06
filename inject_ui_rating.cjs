const fs = require('fs');

const interviewRatingFields = `
              ) : formData.type === 'interviewRating' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Candidate Name</label>
                      <input type="text" value={formData.candidateName || ''} onChange={e => setFormData({...formData, candidateName: e.target.value, title: \`Interview Rating: \${e.target.value}\`})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tel</label>
                      <input type="text" value={formData.contactNo || ''} onChange={e => setFormData({...formData, contactNo: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Gender</label>
                      <select value={formData.gender || ''} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white">
                        <option value="">Select</option>
                        <option value="F">Female</option>
                        <option value="M">Male</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Staff Type</label>
                      <select value={formData.staffType || ''} onChange={e => setFormData({...formData, staffType: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white">
                        <option value="Staff">Staff</option>
                        <option value="Teachers (FT)">Teachers (FT)</option>
                        <option value="Teachers (PT)">Teachers (PT)</option>
                        <option value="Teachers (SFT)">Teachers (SFT)</option>
                        <option value="Teachers (INTERN)">Teachers (INTERN)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Nationality</label>
                      <input type="text" value={formData.nationality || 'Khmer'} onChange={e => setFormData({...formData, nationality: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Apply for (position)</label>
                      <input type="text" value={formData.positionTitle || ''} onChange={e => setFormData({...formData, positionTitle: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Interview Date</label>
                      <input type="text" value={formData.interviewDate || ''} onChange={e => setFormData({...formData, interviewDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" placeholder="DD/MM/YYYY" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Current Salary</label>
                      <input type="text" value={formData.currentSalary || ''} onChange={e => setFormData({...formData, currentSalary: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Expected Salary (USD)</label>
                      <input type="text" value={formData.expectedSalary || ''} onChange={e => setFormData({...formData, expectedSalary: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date Available</label>
                      <input type="text" value={formData.dateAvailable || ''} onChange={e => setFormData({...formData, dateAvailable: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Ratings (1 = Poor, 5 = Excellent)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                      {[
                        { k: 'r_dress', l: 'Dress' }, { k: 'r_grooming', l: 'Grooming' }, { k: 'r_bodyLang', l: 'Body Language' }, { k: 'r_eye', l: 'Eye Contact' },
                        { k: 'r_education', l: 'Education' }, { k: 'r_technical', l: 'Technical Quals' }, { k: 'r_experience', l: 'Experience' }, { k: 'r_accomplish', l: 'Accomplishments' },
                        { k: 'r_computer', l: 'Computer Skills' }, { k: 'r_language', l: 'Language Skills' }, { k: 'r_interpersonal', l: 'Interpersonal' },
                        { k: 'r_creativity', l: 'Creativity' }, { k: 'r_logic', l: 'Logic' }, { k: 'r_decision', l: 'Decision Making' }, { k: 'r_commitment', l: 'Commitment' },
                        { k: 'r_potential', l: 'Potential' }, { k: 'r_knowledgeOrg', l: 'Knowledge of Org' }, { k: 'r_interestPos', l: 'Interest in Pos' }, { k: 'r_flexibility', l: 'Flexibility' }, { k: 'r_enthusiasm', l: 'Enthusiasm' }
                      ].map(f => (
                        <div key={f.k} className="flex justify-between items-center">
                          <label className="text-xs text-gray-600 dark:text-gray-400 w-1/2">{f.l}</label>
                          <select value={formData[f.k] || ''} onChange={e => setFormData({...formData, [f.k]: e.target.value})} className="w-1/2 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-transparent">
                            <option value="">-</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option>
                          </select>
                        </div>
                      ))}
                      
                      <div className="flex justify-between items-center sm:col-span-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <label className="font-semibold text-gray-900 dark:text-white">Total Overall Score</label>
                        <input type="text" value={formData.totalScore || ''} onChange={e => setFormData({...formData, totalScore: e.target.value})} className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-center" placeholder="e.g. 85" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Relative Working in WIS</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <input type="text" placeholder="Name" value={formData.relativeName || ''} onChange={e => setFormData({...formData, relativeName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                      <input type="text" placeholder="Gender" value={formData.relativeGender || ''} onChange={e => setFormData({...formData, relativeGender: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                      <input type="text" placeholder="Position" value={formData.relativePosition || ''} onChange={e => setFormData({...formData, relativePosition: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>

                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Summary Comments</label>
                    <textarea value={formData.summaryComments || ''} onChange={e => setFormData({...formData, summaryComments: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white min-h-[60px]" />

                    <div className="flex flex-wrap gap-4 items-center">
                      <label className="font-medium text-gray-700 dark:text-gray-300">Decision:</label>
                      <select value={formData.decision || ''} onChange={e => setFormData({...formData, decision: e.target.value})} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white">
                        <option value="">Select</option><option value="HIRE">HIRE</option><option value="CONSIDER">CONSIDER</option><option value="REJECT">REJECT</option>
                      </select>
                      {formData.decision === 'HIRE' && (
                        <input type="text" placeholder="Confirmed Salary (USD)" value={formData.hireSalary || ''} onChange={e => setFormData({...formData, hireSalary: e.target.value})} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                      )}
                    </div>
                  </div>
                </>
`;

let c = fs.readFileSync('src/components/InternalForms.tsx', 'utf8');
c = c.replace(/\) : \(\s*<>\s*<div>\s*<label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title<\/label>/, interviewRatingFields + '\n              ) : (\n                <>\n                  <div>\n                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>');

// Also update the candidate filtering
const filterRegex = /\{candidates\.map\(c => \(/;
const filterReplacement = `{candidates.filter(c => c.isShortlisted || c.status === 'interviewing' || c.status === 'interview' || c.status === 'shortlisted').map(c => (`;
c = c.replace(filterRegex, filterReplacement);

fs.writeFileSync('src/components/InternalForms.tsx', c);
