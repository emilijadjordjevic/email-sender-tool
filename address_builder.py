emails = []

for i in range(1, 211):
    for year in ["2022"]:
        email = f"{i}-{year}@pmf.kg.ac.rs"
        emails.append(email)

for i in range(1, 199):
    for year in ["2021"]:
        email = f"{i}-{year}@pmf.kg.ac.rs"
        emails.append(email)

for i in range(1, 185):
    for year in ["2023"]:
        email = f"{i}-{year}@pmf.kg.ac.rs"
        emails.append(email)

for i in range(1, 191):
    for year in ["2024"]:
        email = f"{i}-{year}@pmf.kg.ac.rs"
        emails.append(email)

with open("emails.txt", "w") as f:
    for email in emails:
        f.write(email + "\n")