const fs = require('fs');
let c = fs.readFileSync('src/components/InternalForms.tsx', 'utf8');

const clearanceFields = `
              ) : formData.type === 'clearance' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Employee ID</label>
                      <input type="text" value={formData.employeeId || ''} onChange={e => setFormData({...formData, employeeId: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Employee Name</label>
                      <input type="text" value={formData.employeeName || ''} onChange={e => setFormData({...formData, employeeName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Starting Date</label>
                      <input type="text" value={formData.startDate || ''} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Position</label>
                      <input type="text" value={formData.positionTitle || ''} onChange={e => setFormData({...formData, positionTitle: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Campus</label>
                      <input type="text" value={formData.campus || ''} onChange={e => setFormData({...formData, campus: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Phone number</label>
                      <input type="text" value={formData.contactNo || ''} onChange={e => setFormData({...formData, contactNo: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Last day of work</label>
                      <input type="text" value={formData.lastDayOfWork || ''} onChange={e => setFormData({...formData, lastDayOfWork: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white" />
                    </div>
                  </div>
                </>
              ) : (`;

c = c.replace(/\s*\)\s*:\s*\(\s*<>\s*<div>\s*<label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title<\/label>/, clearanceFields + '\n                  <>\n                    <div>\n                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>');

fs.writeFileSync('src/components/InternalForms.tsx', c);
