import random

def find_duplicates(lst):
    duplicates = []
    for i in range(len(lst)):
        for j in range(i + 1, len(lst)):
            if lst[i] == lst[j] and lst[i] not in duplicates:
                duplicates.append(lst[i])
    return duplicates

data = list(range(3000)) + list(range(1000))
result = find_duplicates(data)
print(sorted(result))