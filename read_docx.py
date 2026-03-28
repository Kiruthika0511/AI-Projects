import zipfile
import re

docx_path = r"c:\Users\Kiruthika_Balakrishn\AITesterBlueprint\My Project\Project_04_AI_Agents\test_plan_template copy\Test Plan - Template.docx"

try:
    with zipfile.ZipFile(docx_path) as z:
        if 'word/document.xml' in z.namelist():
            xml_content = z.read('word/document.xml').decode('utf-8')
            # Extract basic text from paragraphs
            text = re.sub('<w:p[^>]*>', '\n', xml_content)
            text = re.sub('<[^>]+>', '', text)
            
            with open("extracted_template.txt", "w", encoding="utf-8") as f:
                f.write(text.strip())
            print("Successfully extracted to extracted_template.txt")
except Exception as e:
    print(f"Error: {e}")
