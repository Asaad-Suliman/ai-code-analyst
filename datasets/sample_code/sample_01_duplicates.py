# Sample 1: Classic O(n^2) duplicate finder
# Expected: Optimizer should replace with set-based O(n) approach

def find_duplicates(lst):
    duplicates = []
    for i in range(len(lst)):
        for j in range(i + 1, len(lst)):
            if lst[i] == lst[j] and lst[i] not in duplicates:
                duplicates.append(lst[i])
    return duplicates

print(find_duplicates([1, 2, 3, 2, 4, 5, 1, 6, 7, 5]))
