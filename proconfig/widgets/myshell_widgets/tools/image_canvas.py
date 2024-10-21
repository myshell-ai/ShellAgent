from proconfig.widgets.base import BaseWidget, WIDGETS
import time
from proconfig.utils.misc import upload_file_to_myshell
import json

import tempfile

from playwright.sync_api import sync_playwright
import json
import os

def export_as_png(page, output_png_path, max_retries=3):
    hover_success = False
    for attempt in range(max_retries):
        try:
            print(f"Try to export PNG, for {attempt + 1} time")
            
            if not hover_success:
                export_button = page.locator('//*[@id="ice-container"]/div/div[3]/aside[2]/div/div[1]/div[3]/span[2]')
                export_button.wait_for(state='visible', timeout=10000)

                if export_button.is_visible():
                    export_button.hover()
                    page.evaluate("""
                        () => {
                            const button = document.evaluate('//*[@id="ice-container"]/div/div[3]/aside[2]/div/div[1]/div[3]/span[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                            const event = new MouseEvent('mouseover', {
                                'view': window,
                                'bubbles': true,
                                'cancelable': true
                            });
                            button.dispatchEvent(event);
                        }
                    """)
                else:
                    raise Exception("Export fail")
                hover_success = True

            png_button = page.locator('text="Export as PNG"')
            png_button.wait_for(state='visible', timeout=5000)
            page.wait_for_timeout(500)

            if png_button.is_visible():
                with page.expect_download() as download_info:
                    png_button.click()
                download = download_info.value
                # Save directly to the specified temporary file path
                download.save_as(output_png_path)
                print(f"Operation completed, image saved as {output_png_path}")
            else:
                # print("'Export as PNG' menu item not found")
                raise Exception("'Export as PNG' menu item not found")

            return True
        
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                pass
            else:
                print("All attempts failed")
                return False

def automate_fabritor(json_file_path, output_png_path):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        page.goto("https://image-canvas.myshell.fun/")
        
        # Wait for the page to finish loading
        page.wait_for_load_state("networkidle")
        
        # Find and click the "Import" button
        try:
            import_button = page.locator('//*[@id="ice-container"]/div/div[3]/aside[2]/div/div[1]/div[3]/span[1]')
            if import_button.is_visible():
                with page.expect_file_chooser() as fc_info:
                    import_button.click()
                file_chooser = fc_info.value
                # Set the file path to upload, ensure the path is correct
                file_chooser.set_files(json_file_path)
                print("Successfully uploaded JSON file")
        except Exception as e:
            print(f"Error clicking Import button: {e}")
        
        # Wait for loading to complete
        # page.wait_for_selector('//*[@id="ice-container"]/div/div[3]/aside[2]/div/div[1]/div[3]/span[2]', state='visible', timeout=10000)
        
        export_as_png(page, output_png_path)
        
        browser.close()

@WIDGETS.register_module()
class ImageCanvasWidget(BaseWidget):
    NAME = "Image Canvas"
    CATEGORY = 'Myshell Widgets/Tools'
    
    class InputsSchema(BaseWidget.InputsSchema):
        config: str
    
    class OutputsSchema(BaseWidget.OutputsSchema):
        image: str
        
    def execute(self, environ, config):
        return_dict = {}

        parsed_config = json.loads(config.config)

        # Define a recursive function to process nested objects
        def process_objects(objects):
            for obj in objects:
                if obj.get('type') == 'image' and 'src' in obj:
                    local_path = obj['src']
                    if not local_path.startswith('http') and os.path.isfile(local_path):
                        # Upload the image and get the URL
                        url = upload_file_to_myshell(local_path)
                        obj['src'] = url
                        print(f"Uploaded {local_path} and replaced with {url}")
                
                # If the object has child objects, process them recursively
                if 'objects' in obj:
                    process_objects(obj['objects'])

        process_objects(parsed_config['objects'])

        # Save configuration to a temporary JSON file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as temp_json:
            json.dump(parsed_config, temp_json)
            temp_json_path = temp_json.name

        # Use a temporary file to save the downloaded PNG image
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_png:
            temp_png_path = temp_png.name

        # Call the automate_fabritor function, passing the temporary JSON file path and temporary PNG file path
        automate_fabritor(temp_json_path, temp_png_path)

        # Upload the image to myshell
        return_dict['image'] = upload_file_to_myshell(temp_png_path)
        print(return_dict['image'])

        # Clean up temporary files
        os.unlink(temp_json_path)
        os.unlink(temp_png_path)

        return return_dict

if __name__ == "__main__":
    widget = ImageCanvasWidget()
    config = open('proconfig/widgets/myshell_widgets/tools/test.json', 'r').read()
    widget.execute(environ={}, config={'config': config})
