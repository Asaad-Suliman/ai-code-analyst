# Sample 2: Bubble sort — worst-case O(n^2)
# Expected: Optimizer should suggest using built-in sorted() or better algorithm

def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

import random
data = [random.randint(1, 10000) for _ in range(5000)]
result = bubble_sort(data.copy())
print(f"Sorted {len(result)} items. First 10: {result[:10]}")
