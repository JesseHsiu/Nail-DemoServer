import glob
import csv
import numpy as np


# list csv files
filelist = glob.glob('*.csv')

print len(filelist)

for x in xrange(0,len(filelist)):
	with open(filelist[x], 'rb') as f:

		reader = csv.reader(f)

		dataHeader = reader.next()
		firstData = reader.next()

		finalOuputArray = np.zeros(19, dtype=np.int)

		finalOuputArray[18] = int(filelist[x][4])

		for row in reader:
			initPosition = 9
			for i in xrange(0,9):
				if int(float(row[initPosition])) - int(float(firstData[initPosition])) > 0:
					finalOuputArray[i*2] += abs(int(float(row[initPosition])) - int(float(firstData[initPosition])))
				else :
					finalOuputArray[i*2+1] += abs(int(float(row[initPosition])) - int(float(firstData[initPosition])))
				initPosition += 3


		# print filelist[x]
		np.savetxt('../calculated/'+filelist[x], finalOuputArray[None], fmt='%d', delimiter=',',header='1+,1-,2+,2-,3+,3-,4+,4-,5+,5-,6+,6-,7+,7-,8+,8-,9+,9-,d')
