import pandas as pd

df = pd.read_csv('jobAds.csv')
df.drop_duplicates(inplace=True)
df.to_csv('jobAds.csv', index=False)
