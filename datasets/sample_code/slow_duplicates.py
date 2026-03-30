"""
Sample: Nested loop duplicate finder
This is intentionally slow — O(n^2) complexity.
Good test case because the optimization is obvious.
"""

def find_duplicates(lst):
    duplicates = []
    for i in range(len(lst)):
        for j in range(i + 1, len(lst)):
            if lst[i] == lst[j] and lst[i] not in duplicates:
                duplicates.append(lst[i])
    return duplicates

print(find_duplicates([1, 2, 3, 2, 4, 5, 1, 6, 7, 5]))
