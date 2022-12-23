# Outline

## Models

1. Document -> Is the reference point to access files and folders
   - Can be public or private. Public means everyone can view, but they cannot edit.
2. Files -> Current supported types: Images, Videos, PDFs
3. Folders -> Has a child array that contains Document objects

## Query a file/folder

1. Get the Document related to it from folder
2. Then query the file from childId(field)
3. Should return both the Document and File/Folder on request
   Note: The files/folders list on the frontend should be from the Document object only

## Adding Files/Folder

1. Path string will be used to check if it is in user main folder
2. If not, folder id will be used to query folder and document will be added there.
   This allows for folders with the same name (although idt it will be useful)

## Paths

- Paths are all stored on the Document object
- Files and folders should be standalone and only accessible via their Document reference
- File paths: [...parentPath]/[filename]
- Folder paths: [...parentPath]/[foldername]/

# TODO

1. Create page to view folder [x]
2. Allow user to add files/folders from folder page [x]
   - Fix the path variable on document objects [x]
3. Create a component to list files/folders out [x]
4. Fix deleting folder (ensure that its children are deleted too) [x]
   - Use recursion?
5. Fix renaming folder [x]
   - Change pathing to objectid instead of name [x]
6. Add preview images (https://www.npmjs.com/package/sharp) [x]
7. Implement permissions + public/private. [x]
   - Info stored in Document
   - Recursion to update all child documents
8. Implement searchbar [x]
9. Add filters to searchbar [x]
   - filter by fileType (pdf, images, video)
10. Fix file page [x]
11. Implement login and signup [x]
12. Make profile page [x]
13. Implement zooming in for files [ ] (may not need)
14. Fix file adding UI [x]
15. Add email to User [x]
16. Add userId checks (authentication) to API routes

## Fonts

font-family: 'Roboto', sans-serif;
