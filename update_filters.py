import os
import re

components = ['src/components/Applications.tsx', 'src/components/Shortlist.tsx', 'src/components/Interviews.tsx']

for file in components:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add state variables
    state_vars = """
  const [filterName, setFilterName] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [filterDate, setFilterDate] = useState('');
"""
    
    # Replace existing searchTerm state if present
    if 'const [searchTerm, setSearchTerm]' in content:
        content = re.sub(r'const \[searchTerm, setSearchTerm\] = useState\([^)]*\);', state_vars.strip(), content)

    # Modify filtering logic
    filter_body = """{
    const target = item.name || item.candidateName || '';
    const position = item.position || '';
    const dateField = item.appliedAt || item.date || item.createdAt;
    
    const matchesName = filterName === '' || target.toLowerCase().includes(filterName.toLowerCase());
    const matchesPosition = filterPosition === '' || position.toLowerCase().includes(filterPosition.toLowerCase());
    
    let matchesDate = true;
    if (filterDate && dateField) {
      try {
        const itemDate = typeof dateField === 'string' ? new Date(dateField) : new Date(dateField.seconds ? dateField.seconds * 1000 : dateField);
        const yyyy = itemDate.getFullYear();
        const mm = String(itemDate.getMonth() + 1).padStart(2, '0');
        const dd = String(itemDate.getDate()).padStart(2, '0');
        const formatted = `${yyyy}-${mm}-${dd}`;
        matchesDate = formatted === filterDate;
      } catch(e) {}
    }
    
    const matchesStatus = typeof statusFilter !== 'undefined' ? (statusFilter === 'all' || item.status === statusFilter) : true;
    
    return matchesName && matchesPosition && matchesDate && matchesStatus;
  });"""
    
    content = re.sub(r'const (filtered[a-zA-Z]+) = ([a-zA-Z]+)\.filter\([a-zA-Z]+ => \{[\s\S]*?\}\);', 
                     lambda m: f"const {m.group(1)} = {m.group(2)}.filter(item => {filter_body}", content)

    # Replace UI
    ui_block = """<div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Filter by name..." 
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Filter by position..." 
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div className="relative">
          <input 
            type="date" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>"""
    
    content = re.sub(r'<div className="relative flex-1">[\s\S]*?</input>[\s\S]*?</div>', ui_block, content, count=1)
    
    # Also adjust the flex container wrapper if needed
    content = content.replace('<div className="flex flex-col sm:flex-row gap-4">', '<div className="flex flex-col gap-4">')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
