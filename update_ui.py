import os

file_path = r'src\components\CandidateForm.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Left panel
old_left_panel = """        {/* Left Side: Info */}
        <div className="bg-blue-600 p-8 md:w-2/5 text-white flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <p className="text-blue-100 leading-relaxed">
            We are always looking for talented individuals to join our growing company. Fill out the form to submit your application directly to our HR portal.
          </p>
        </div>"""

new_left_panel = """        {/* Left Side: Info */}
        <div className="relative p-10 md:w-2/5 text-white flex flex-col justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white opacity-10 blur-3xl pointer-events-none"></div>
          <h2 className="text-4xl font-extrabold mb-4 relative z-10 tracking-tight">Join Our Team</h2>
          <p className="text-blue-50 text-lg leading-relaxed relative z-10 font-light">
            We are always looking for talented individuals to join our growing company. Fill out the form to submit your application directly to our HR portal.
          </p>
        </div>"""

content = content.replace(old_left_panel, new_left_panel)

# Form title
content = content.replace('<h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Candidate Application</h3>', '<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Candidate Application</h3>')

# Inputs
old_input = 'className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"'
new_input = 'className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-sm"'
content = content.replace(old_input, new_input)

# Form spacing
content = content.replace('<form onSubmit={handleSubmit} className="space-y-5">', '<form onSubmit={handleSubmit} className="space-y-6">')

# Submit button
old_button = """            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-70"
            >"""
new_button = """            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-70 transform hover:-translate-y-0.5"
            >"""
content = content.replace(old_button, new_button)

# Also update the link input if it uses a slightly different class
old_link_input = 'className="w-full px-4 py-2 pr-24 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"'
new_link_input = 'className="w-full px-4 py-2.5 pr-24 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all shadow-sm"'
content = content.replace(old_link_input, new_link_input)

# Update the file input visual area
old_file_box = 'className="w-full flex items-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"'
new_file_box = 'className="w-full flex items-center px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-gray-700"'
content = content.replace(old_file_box, new_file_box)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("UI updated successfully")
