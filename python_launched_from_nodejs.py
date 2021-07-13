import time
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--hello')
args = parser.parse_args()

print(args.hello, flush=True)
time.sleep(1)
print("I am talking from Python", flush=True)
time.sleep(1)
print("I really like Python", flush=True)
time.sleep(1)
print("But JS is cool too", flush=True)