"""
Sample: Bubble sort
Classic O(n^2) sorting that can be replaced with built-in sort.
"""

def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

data = [64, 34, 25, 12, 22, 11, 90, 1, 55, 78, 42, 33]
print(bubble_sort(data))
