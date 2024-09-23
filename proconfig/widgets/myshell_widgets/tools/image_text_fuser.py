import os
from proconfig.widgets.base import BaseWidget, WIDGETS
from typing import Literal, Any, Dict
import torch
from proconfig.utils.misc import upload_file_to_myshell
from PIL import Image, ImageDraw, ImageFont
import json
import emoji
from pilmoji import Pilmoji
import tempfile
import requests
from io import BytesIO

font_dir = os.path.abspath('proconfig/widgets/myshell_widgets/tools/fonts')

def calculate_text_width(text, font, node_spacing=1):
    with Image.new('RGBA', (1, 1)) as tmp_img:
        with Pilmoji(tmp_img) as pilmoji:
            width, _ = pilmoji.getsize(text, font=font)
    
    # 计算表情符号的数量
    emoji_count = sum(1 for char in text if char in emoji.EMOJI_DATA)
    
    # 添加 node_spacing 的宽度
    total_width = width + emoji_count * node_spacing
    
    return total_width

def fit_text_to_box(draw, text, box_size, font_path, max_font_size, min_font_size=10, line_spacing_factor=0.2):
    max_width, max_height = box_size
    font_size = max_font_size

    while font_size >= min_font_size:
        font = ImageFont.truetype(os.path.join(font_dir, font_path), font_size)
        words = text.split()
        lines = []
        current_line = []

        try_next = False
        for word in words:
            current_line.append(word)
            line_width = calculate_text_width(' '.join(current_line), font)
            if line_width > max_width:
                if len(current_line) == 1:
                    current_line = [word]
                    try_next = True
                    break
                lines.append(' '.join(current_line[:-1]))
                current_line = [word]
        
        if try_next:
            font_size -= 1
            continue

        if current_line:
            lines.append(' '.join(current_line))

        # Calculate line height and add extra line spacing
        line_height = font.getbbox('Ay')[3] - font.getbbox('Ay')[1]
        line_spacing = line_height * line_spacing_factor
        total_height = (line_height + line_spacing) * len(lines) - line_spacing

        if total_height <= max_height:
            return lines, font, line_height + line_spacing

        font_size -= 1

    return None, None, None  # If it can't fit, return None

def hex_to_rgb(hex_color):
    """Convert hex color string to RGBA tuple"""
    hex_color = hex_color.lstrip('#')
    hex_color = ''.join(c for c in hex_color if c.isalnum())  # Remove all non-alphanumeric characters
    
    if len(hex_color) == 6:
        rgb = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
        return rgb + (255,)  # Add fully opaque alpha value
    elif len(hex_color) == 8:
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4, 6))
    else:
        print(f"Warning: Invalid hex color format '{hex_color}'. Using black.")
        return (0, 0, 0, 255)  # Return black as default

def add_outline_to_text(pilmoji_draw, text, x, y, font, text_color, outline_color, line_height, emoji_position_offset):
    # 绘制文本轮廓（不包含表情符号）
    text_without_emoji = ''.join(char for char in text if char not in emoji.EMOJI_DATA)
    pilmoji_draw.text((x-1, y-1), text_without_emoji, font=font, fill=outline_color)
    pilmoji_draw.text((x+1, y-1), text_without_emoji, font=font, fill=outline_color)
    pilmoji_draw.text((x-1, y+1), text_without_emoji, font=font, fill=outline_color)
    pilmoji_draw.text((x+1, y+1), text_without_emoji, font=font, fill=outline_color)

    # Draw the text itself
    pilmoji_draw.text((x, y), text, font=font, fill=text_color, node_spacing=1, emoji_position_offset=[0, int(emoji_position_offset * line_height)])

def resize_image(img, position, size, method='contain', rotation=0):
    original_width, original_height = img.size
    target_width, target_height = size
    x, y = position

    # First, perform rotation
    if rotation != 0:
        img = img.rotate(rotation, expand=True, resample=Image.BICUBIC)

    if method == 'cover':
        img.thumbnail((target_width * 2, target_height * 2), Image.LANCZOS)
        img = img.crop((
            (img.width - target_width) // 2,
            (img.height - target_height) // 2,
            (img.width + target_width) // 2,
            (img.height + target_height) // 2
        ))
        return img, position

    elif method == 'contain':
        img.thumbnail(size, Image.LANCZOS)
        paste_x = x + (target_width - img.width) // 2
        paste_y = y + (target_height - img.height) // 2
        return img, (paste_x, paste_y)

    elif method == 'fill':
        img = img.resize(size, Image.LANCZOS)
        return img, position

    else:
        raise ValueError("Invalid resize method. Choose 'cover', 'contain', or 'fill'.")

def get_image(image_path):
    image_path = image_path.strip()
    if image_path.startswith('http'):
        response = requests.get(image_path)
        response.raise_for_status()
        return Image.open(BytesIO(response.content)).convert('RGBA')
    else:
        return Image.open(image_path).convert('RGBA')

from pilmoji.source import (
    BaseSource, HTTPBasedSource, DiscordEmojiSourceMixin, EmojiCDNSource,
    TwitterEmojiSource, AppleEmojiSource, GoogleEmojiSource, 
    MicrosoftEmojiSource, FacebookEmojiSource, MessengerEmojiSource,
    EmojidexEmojiSource, JoyPixelsEmojiSource, SamsungEmojiSource,
    WhatsAppEmojiSource, MozillaEmojiSource, OpenmojiEmojiSource,
    TwemojiEmojiSource, FacebookMessengerEmojiSource, Twemoji, Openmoji
)

def get_emoji_source(emoji_source_str):
    source_class = EMOJI_SOURCES.get(emoji_source_str, TwitterEmojiSource)
    return source_class()

# 创建一个字典,将字符串映射到相应的 source 类
EMOJI_SOURCES = {
    'HTTPBasedSource': HTTPBasedSource,
    'DiscordEmojiSourceMixin': DiscordEmojiSourceMixin,
    'EmojiCDNSource': EmojiCDNSource,
    'TwitterEmojiSource': TwitterEmojiSource,
    'AppleEmojiSource': AppleEmojiSource,
    'GoogleEmojiSource': GoogleEmojiSource,
    'MicrosoftEmojiSource': MicrosoftEmojiSource,
    'FacebookEmojiSource': FacebookEmojiSource,
    'MessengerEmojiSource': MessengerEmojiSource,
    'EmojidexEmojiSource': EmojidexEmojiSource,
    'JoyPixelsEmojiSource': JoyPixelsEmojiSource,
    'SamsungEmojiSource': SamsungEmojiSource,
    'WhatsAppEmojiSource': WhatsAppEmojiSource,
    'MozillaEmojiSource': MozillaEmojiSource,
    'OpenmojiEmojiSource': OpenmojiEmojiSource,
    'TwemojiEmojiSource': TwemojiEmojiSource,
    'FacebookMessengerEmojiSource': FacebookMessengerEmojiSource,
    'Twemoji': Twemoji,
    'Openmoji': Openmoji
}

def add_content_to_image(template_path, content):
    image = get_image(template_path)
    draw = ImageDraw.Draw(image, mode='RGBA')
    emoji_source = content.get('emoji_source', 'TwitterEmojiSource')
    emoji_source = get_emoji_source(emoji_source)
    pilmoji_draw = Pilmoji(image, source=emoji_source)

    layers = []
    default_z_index = 0

    # Handle title
    if 'title' in content:
        title = content['title']
        title_font = ImageFont.truetype(os.path.join(font_dir, title['font']), title['font_size'])
        title_box_size = (image.width, 50)  # Adjust height as needed
        title_lines, title_font, line_height = fit_text_to_box(draw, title['text'], title_box_size, title['font'], title['font_size'])
        title_color = title.get('color', '000000FF')  # default black
        if isinstance(title_color, str):
            title_color = hex_to_rgb(title_color)
        if title_lines:
            y = 50  # Adjust top margin as needed
            for line in title_lines:
                line_width = title_font.getlength(line)
                x = (image.width - line_width) / 2  # Center horizontally
                layers.append({
                    'type': 'text',
                    'content': line,
                    'position': (x, y),
                    'font': title_font,
                    'color': title_color,
                    'z_index': title.get('z_index', default_z_index),
                    'outline_color': title.get('outline_color'),
                    'line_height': 0,
                    'emoji_position_offset': 0
                })
                y += line_height
                default_z_index += 1

    for box in content['boxes']:
        position = tuple(box['position'])
        size = tuple(box['size'])
        z_index = box.get('z_index', default_z_index)
        emoji_position_offset = box.get('emoji_position_offset', 0)
        default_z_index += 1

        if 'text' in box:
            text = box['text']
            font_path = os.path.join(font_dir, box.get('font', content.get('font', 'Oswald-Regular.ttf')))
            font_size = box['font_size']
            color = box.get('color', '000000FF')
            if isinstance(color, str):
                color = hex_to_rgb(color)
            
            underline = box.get('underline', False)
            text_align = box.get('text_align', 'center')
            vertical_align = box.get('vertical_align', 'center')
            outline_color = box.get('outline_color')

            lines, font, line_height = fit_text_to_box(draw, text, size, font_path, font_size)
            if not lines:
                print(f"Warning: Text '{text}' doesn't fit in the box even at 1pt size.")
                continue

            x, y = position
            box_width, box_height = size
            text_height = len(lines) * line_height

            # Vertical alignment
            if vertical_align == 'top':
                y_start = y
            elif vertical_align == 'bottom':
                y_start = y + box_height - text_height
            else:  # center
                y_start = y + (box_height - text_height) / 2

            for line in lines:
                line_width = calculate_text_width(line, font)
                
                # Horizontal alignment
                if text_align == 'left':
                    x_aligned = x
                elif text_align == 'right':
                    x_aligned = x + box_width - line_width
                else:  # center
                    x_aligned = x + (box_width - line_width) / 2

                layers.append({
                    'type': 'text',
                    'content': line,
                    'position': (x_aligned, y_start),
                    'font': font,
                    'color': color,
                    'underline': underline,
                    'z_index': z_index,
                    'outline_color': outline_color,
                    'line_height': line_height,
                    'emoji_position_offset': emoji_position_offset
                })
                y_start += line_height

        elif 'image' in box:
            try:
                box_image = get_image(box['image'])
                
                rotation = box.get('rotation', 0)
                resize_method = box.get('resize_method', 'contain')
                box_image, paste_position = resize_image(box_image, position, size, resize_method, rotation)
                
                layers.append({
                    'type': 'image',
                    'content': box_image,
                    'position': paste_position,
                    'z_index': z_index
                })
            except Exception as e:
                print(f"Error processing image {box['image']}: {str(e)}")

    # Sort layers based on z_index, maintaining original order for equal z_index values
    layers.sort(key=lambda x: x.get('z_index', 0))
    print([layer['z_index'] for layer in layers])

    # Draw layers in order
    for layer in layers:
        print(layer)
        if layer['type'] == 'text':
            layer['position'] = [int(x) for x in layer['position']]
            if layer.get('outline_color'):
                outline_color = layer['outline_color']
                if isinstance(outline_color, str):
                    outline_color = hex_to_rgb(outline_color)
                print(layer['content'], layer['color'])
                add_outline_to_text(pilmoji_draw, layer['content'], layer['position'][0], layer['position'][1], 
                                    layer['font'], layer['color'], outline_color, layer['line_height'], layer['emoji_position_offset'])
            else:
                pilmoji_draw.text(layer['position'], layer['content'], font=layer['font'], fill=layer['color'], node_spacing=1, emoji_position_offset=[0, int(layer['emoji_position_offset'] * layer['line_height'])])
            
            if layer.get('underline', False):
                x, y = layer['position']
                line_width = layer['font'].getlength(layer['content'])
                y_underline = y + layer['font'].getbbox('A')[3] + 2
                draw.line((x, y_underline, x + line_width, y_underline), fill=layer['color'], width=1)
        elif layer['type'] == 'image':
            temp = Image.new('RGBA', image.size, (0, 0, 0, 0))
            temp.paste(layer['content'], layer['position'], layer['content'])
            image = Image.alpha_composite(image, temp)
            draw = ImageDraw.Draw(image)
            pilmoji_draw = Pilmoji(image, source=emoji_source)

    return image
@WIDGETS.register_module()
class ImageTextFuserWidget(BaseWidget):
    NAME = "Image Text Fuser"
    CATEGORY = 'Myshell Widgets/Tools'
    
    class InputsSchema(BaseWidget.InputsSchema):
        config: str = ""
    
    class OutputsSchema(BaseWidget.OutputsSchema):
        url: str
        
    @torch.no_grad()
    def execute(self, environ, config):
        return_dict = {}

        parsed_config = json.loads(config.config)
        template_path = parsed_config['template_path']

        image = add_content_to_image(template_path, parsed_config)
        with tempfile.NamedTemporaryFile(suffix=".png") as f:
            image.save(f.name)
            f.flush()
            f.seek(0)
            return_dict['url'] = upload_file_to_myshell(f.name)

        return return_dict