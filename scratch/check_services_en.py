import sqlite3

conn = sqlite3.connect('digital_twin.db')
cursor = conn.cursor()

cursor.execute("SELECT id, title, title_en, description_en FROM services;")
rows = cursor.fetchall()

for row in rows:
    print(row)

conn.close()
