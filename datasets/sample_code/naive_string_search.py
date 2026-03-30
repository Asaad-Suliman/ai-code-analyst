"""
Sample: Brute force substring count
Counts how many times a pattern appears in text using naive approach.
"""

def count_substring(text, pattern):
    count = 0
    for i in range(len(text)):
        match = True
        for j in range(len(pattern)):
            if i + j >= len(text) or text[i + j] != pattern[j]:
                match = False
                break
        if match:
            count += 1
    return count

text = "ababababababababab" * 100
print(count_substring(text, "abab"))
