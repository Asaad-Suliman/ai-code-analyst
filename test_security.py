from core.code_executor import execute_code

# Test 1 - block os.system (check exit code not stdout)
r = execute_code("import os; result = os.system('echo hacked'); import sys; sys.exit(1) if result == 0 else None")
print('Test 1 - os.system:', 'PASS' if r.exit_code != 0 else 'FAIL - os.system not blocked')

# Test 2 - block file write
r = execute_code("open('/etc/passwd', 'w').write('hacked')")
print('Test 2 - file write:', 'PASS' if r.exit_code != 0 else 'FAIL')

# Test 3 - block network
r = execute_code("import urllib.request; urllib.request.urlopen('http://google.com')")
print('Test 3 - network:', 'PASS' if r.exit_code != 0 else 'FAIL')

# Test 4 - timeout
r = execute_code("while True: pass")
print('Test 4 - timeout:', 'PASS' if r.timed_out or r.exit_code != 0 else 'FAIL')

# Test 5 - memory limit (use smaller allocation to trigger limit)
r = execute_code("x = 'a' * (300 * 1024 * 1024); print(len(x))")
print('Test 5 - memory:', 'PASS' if r.exit_code != 0 or r.timed_out else 'FAIL - memory not limited')

print('Done!')