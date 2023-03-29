from langdetect import detect

text = "This is some sample text in English."

lang = detect(text)

print(lang)
