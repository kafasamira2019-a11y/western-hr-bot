const fs = require('fs');

let c = fs.readFileSync('src/components/Interviews.tsx', 'utf8');

// 1. Add state variables
c = c.replace(
  "const [location, setLocation] = useState('');",
  "const [building, setBuilding] = useState('E');\n  const [floor, setFloor] = useState('2nd');\n  const [location, setLocation] = useState('https://maps.app.goo.gl/xJT3esDBezChYgM29?g_st=it');"
);

// 2. Add to payload
c = c.replace(
  "stage,\n        location,\n        status: 'Scheduled',",
  "stage,\n        building,\n        floor,\n        location,\n        status: 'Scheduled',"
);

// 3. Clear fields on success
c = c.replace(
  "setInterviewTime('');\n      setLocation('');",
  "setInterviewTime('');\n      setBuilding('E');\n      setFloor('2nd');\n      setLocation('https://maps.app.goo.gl/xJT3esDBezChYgM29?g_st=it');"
);

// 4. Update the form UI
const formToReplace = `            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stage</label>
              <select value={stage} onChange={(e) => setStage(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="First round">First round</option>
                <option value="Second round">Second round</option>
                <option value="Final Round">Final Round</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location / Link</label>
              <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Room 101 or Zoom Link" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2 pt-2">`;

const formReplacement = `            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stage</label>
              <select value={stage} onChange={(e) => setStage(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                <option value="First round">First round</option>
                <option value="Second round">Second round</option>
                <option value="Final Round">Final Round</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Building</label>
              <input type="text" value={building} onChange={(e) => setBuilding(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Floor</label>
              <input type="text" value={floor} onChange={(e) => setFloor(e.target.value)} className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location / Link</label>
              <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Room 101 or Zoom Link" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2 pt-2">`;

c = c.replace(formToReplace, formReplacement);

fs.writeFileSync('src/components/Interviews.tsx', c, 'utf8');
