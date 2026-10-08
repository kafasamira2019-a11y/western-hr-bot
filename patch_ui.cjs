const fs = require('fs');
let content = fs.readFileSync('src/components/InternalForms.tsx', 'utf8');

const statePatch = `
    ackHrDate: '',
    
    // Promotion / Transfer specific
    isPromotion: false,
    isTransfer: false,
    isPayrollChange: false,
    employeeStatus: 'Full-time',
    positionEffectiveDate: '',
    salaryEffectiveDate: '',
    rateChange: '',
    rateChangeType: 'month',
    rateChangeTo: '',
    rateChangeTypeTo: 'month',
    reasonForChange: false,
    reasonFrom: '',
    reasonTo: '',
    transferCampus: false,
    campusFrom: '',
    campusTo: '',
    transferPosition: false,
    positionFrom: '',
    positionTo: '',
    isPromotionCheck: false,
    promotionFrom: '',
    promotionTo: '',
    isDemotion: false,
    demotionFrom: '',
    demotionTo: '',
    statusChange: false,
    statusFrom: 'Full-time',
    statusTo: 'Full-time',
    workingDaysChange: false,
    workingDaysFromEnd: 'Saturday',
    workingDaysToEnd: 'Saturday',
    workingHoursChange: false,
    hoursAmFromStart: '7:30 AM',
    hoursAmFromEnd: '11:30 AM',
    hoursAmToStart: '7:30 AM',
    hoursAmToEnd: '11:30 AM',
    hoursPmFromStart: '1:00 PM',
    hoursPmFromEnd: '5:00 PM',
    hoursPmToStart: '1:00 PM',
    hoursPmToEnd: '5:00 PM'
`;

content = content.replace(/ackHrDate: ''/, statePatch);

const jsxPatch = `
              ) : formData.type === 'promotionTransfer' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="col-span-full flex gap-4 mb-2">
                      <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isPromotion} onChange={e => setFormData({...formData, isPromotion: e.target.checked})} /> Promotion</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isTransfer} onChange={e => setFormData({...formData, isTransfer: e.target.checked})} /> Employee Transfer</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={formData.isPayrollChange} onChange={e => setFormData({...formData, isPayrollChange: e.target.checked})} /> Payroll Change</label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Employee's Name</label>
                      <input type="text" value={formData.employeeName || ''} onChange={e => setFormData({...formData, employeeName: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Position</label>
                      <input type="text" value={formData.positionTitle || ''} onChange={e => setFormData({...formData, positionTitle: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Sex</label>
                      <input type="text" value={formData.sex || ''} onChange={e => setFormData({...formData, sex: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Employment Date</label>
                      <input type="date" value={formData.employmentDate || ''} onChange={e => setFormData({...formData, employmentDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Department</label>
                      <input type="text" value={formData.department || ''} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Campus</label>
                      <input type="text" value={formData.campus || ''} onChange={e => setFormData({...formData, campus: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Employee Status</label>
                      <select value={formData.employeeStatus || 'Full-time'} onChange={e => setFormData({...formData, employeeStatus: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800">
                        <option value="Full-time">Full-time</option>
                        <option value="Semi Full-time">Semi Full-time</option>
                        <option value="Part-time">Part-time</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Employee's ID</label>
                      <input type="text" value={formData.employeeId || ''} onChange={e => setFormData({...formData, employeeId: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Position Effective Date</label>
                      <input type="date" value={formData.positionEffectiveDate || ''} onChange={e => setFormData({...formData, positionEffectiveDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Salary Effective Date</label>
                      <input type="date" value={formData.salaryEffectiveDate || ''} onChange={e => setFormData({...formData, salaryEffectiveDate: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800" />
                    </div>
                    
                    <div className="col-span-full border-t pt-2 mt-2 font-bold">Changes details</div>
                    
                    <div className="col-span-full grid grid-cols-2 gap-4 border p-3 rounded-lg">
                      <div>
                         <label className="text-sm font-medium">Rate Change ($):</label>
                         <div className="flex gap-2 mt-1">
                           <input type="number" value={formData.rateChange || ''} onChange={e => setFormData({...formData, rateChange: e.target.value})} className="w-24 px-2 py-1 border rounded" />
                           <select value={formData.rateChangeType || 'month'} onChange={e => setFormData({...formData, rateChangeType: e.target.value})} className="px-2 py-1 border rounded"><option value="hour">hour</option><option value="month">month</option></select>
                         </div>
                      </div>
                      <div>
                         <label className="text-sm font-medium">To ($):</label>
                         <div className="flex gap-2 mt-1">
                           <input type="number" value={formData.rateChangeTo || ''} onChange={e => setFormData({...formData, rateChangeTo: e.target.value})} className="w-24 px-2 py-1 border rounded" />
                           <select value={formData.rateChangeTypeTo || 'month'} onChange={e => setFormData({...formData, rateChangeTypeTo: e.target.value})} className="px-2 py-1 border rounded"><option value="hour">hour</option><option value="month">month</option></select>
                         </div>
                      </div>
                    </div>

                    {['reasonForChange', 'transferCampus', 'transferPosition', 'isPromotionCheck', 'isDemotion'].map(field => (
                      <div key={field} className="col-span-full grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-4 flex items-center gap-2">
                           <input type="checkbox" checked={formData[field]} onChange={e => setFormData({...formData, [field]: e.target.checked})} />
                           <label className="text-sm font-medium capitalize">{field.replace('is', '').replace(/([A-Z])/g, ' $1')}</label>
                        </div>
                        <div className="col-span-4 flex items-center gap-2">
                           <span className="text-sm">From</span>
                           <input type="text" value={formData[field === 'reasonForChange' ? 'reasonFrom' : field === 'transferCampus' ? 'campusFrom' : field === 'transferPosition' ? 'positionFrom' : field === 'isPromotionCheck' ? 'promotionFrom' : 'demotionFrom'] || ''} onChange={e => setFormData({...formData, [field === 'reasonForChange' ? 'reasonFrom' : field === 'transferCampus' ? 'campusFrom' : field === 'transferPosition' ? 'positionFrom' : field === 'isPromotionCheck' ? 'promotionFrom' : 'demotionFrom']: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-800" />
                        </div>
                        <div className="col-span-4 flex items-center gap-2">
                           <span className="text-sm">To</span>
                           <input type="text" value={formData[field === 'reasonForChange' ? 'reasonTo' : field === 'transferCampus' ? 'campusTo' : field === 'transferPosition' ? 'positionTo' : field === 'isPromotionCheck' ? 'promotionTo' : 'demotionTo'] || ''} onChange={e => setFormData({...formData, [field === 'reasonForChange' ? 'reasonTo' : field === 'transferCampus' ? 'campusTo' : field === 'transferPosition' ? 'positionTo' : field === 'isPromotionCheck' ? 'promotionTo' : 'demotionTo']: e.target.value})} className="w-full px-2 py-1 border rounded dark:bg-gray-800" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
`;

content = content.replace(/\) : \(\s*<>\s*<div>\s*<label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title<\/label>/, jsxPatch + `
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>`);

fs.writeFileSync('src/components/InternalForms.tsx', content);
console.log('Patched InternalForms.tsx successfully.');
