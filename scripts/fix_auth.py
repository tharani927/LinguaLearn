with open(r"C:\Users\thara\.gemini\antigravity\scratch\LinguaLearn\backend\src\services\authService.js", "r", encoding="utf-8") as f:
    text = f.read()

old_s = "VALUES ($1, 'LOGIN', 'USER', $1)"
new_s = "VALUES ($1, 'LOGIN', 'USER', $2)"

if old_s in text:
    text = text.replace(old_s, new_s)
    with open(r"C:\Users\thara\.gemini\antigravity\scratch\LinguaLearn\backend\src\services\authService.js", "w", encoding="utf-8") as f:
        f.write(text)
    print("Replaced successfully!")
else:
    print("Not found!")
