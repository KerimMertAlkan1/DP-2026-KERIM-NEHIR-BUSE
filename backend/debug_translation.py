# Debug translation issues
from utils.translator import translator

# Test specific problematic content
test_content = """Pros: 
* Best customer support in Turkey compare to similar companies such as hepsiburada, trendyol and n11
* Fast delivery by Kolay Gelsin cargo company

Cons:
* Publishing customer reviews ve...See more"""

print("Testing Turkish detection:")
print(f"Is Turkish: {translator.is_turkish(test_content)}")
print(f"Content length: {len(test_content)}")

# Test translation
try:
    translated = translator.translate_to_turkish(test_content)
    print(f"Translation successful: {translated[:100]}...")
except Exception as e:
    print(f"Translation failed: {str(e)}")
