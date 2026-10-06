const fs = require('fs');
let content = fs.readFileSync('src/components/Interviews.tsx', 'utf8');

content = content.replace('stage,\n        status: \'Scheduled\',', 'stage,\n        location,\n        status: \'Scheduled\',');
content = content.replace('stage,\r\n        status: \'Scheduled\',', 'stage,\r\n        location,\r\n        status: \'Scheduled\',');
content = content.replace('scheduleType: interviewType, stage });', 'scheduleType: interviewType, stage, location });');

const formAdd = `              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location / Link</label>
                <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Room 101 or Zoom Link" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="md:col-span-2 pt-2">`;

content = content.replace('<div className="md:col-span-2 pt-2">', formAdd);

// Also add location display in the table
const displayAdd = `                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                          {inv.interviewType === 'Online' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />} {inv.interviewType}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">{inv.stage}</div>
                        {inv.location && <div className="text-gray-500 font-medium text-xs mt-1">📍 {inv.location}</div>}
                      </td>`;

content = content.replace(/<td className="px-6 py-4">\s*<div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">\s*{inv.interviewType === 'Online' \? <Video className="w-3 h-3" \/> : <MapPin className="w-3 h-3" \/>} {inv\.interviewType}\s*<\/div>\s*<div className="text-gray-500 text-xs mt-0\.5">{inv\.stage}<\/div>\s*<\/td>/, displayAdd);

fs.writeFileSync('src/components/Interviews.tsx', content);
