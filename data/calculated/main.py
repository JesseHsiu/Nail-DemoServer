import glob
import csv
import numpy as np


# list csv files
filelist = glob.glob('*.csv')

header = False

with open("trainning.csv", 'w') as f2:
	a = csv.writer(f2, delimiter=',')

	for x in xrange(0,len(filelist)):
		with open(filelist[x], 'rb') as f:

			reader = csv.reader(f)
			dataHeader = reader.next()
			data = reader.next()
			# if header == False:
			# 	a.writerow(dataHeader)
			# 	header = True
			a.writerow(data)
