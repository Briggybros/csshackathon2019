import json;
import pprint;
import datetime;
import dateutil.parser as dp;
import matplotlib.pyplot as plt;

data = {}
rowCount = 24
colCount = 7

with open('testCal.json', 'r') as inputFile:
    data = json.load(inputFile);

def getListOfEvents(data,targetText):
    listOfTargetEvents = []
    listOfOtherEvents = []
    for event in data["items"]:
        thisEventDesc = event['summary'];
        if(targetText in thisEventDesc.lower()):
            listOfTargetEvents.append(event);
        else:
            listOfOtherEvents.append(event);
    return listOfTargetEvents, listOfOtherEvents


def getCalendarMatrix(listOfTargetEvents, listOfOtherEvents, targetText):
    dictOfTimeToEvent = {}

    targetEventTimes = [dp.parse(event["start"]["dateTime"]) for event in listOfTargetEvents];
    otherEventTimes = [dp.parse(event["start"]["dateTime"]) for event in listOfOtherEvents];
    print(targetEventTimes)
    for ind, event in enumerate(listOfTargetEvents + listOfOtherEvents):
        dateTime = event["start"]["dateTime"];
        pyDT = dp.parse(dateTime)
        event["start"]["dateTime"] = pyDT;
        dictOfTimeToEvent[pyDT] = event;

    minTime = min(targetEventTimes);
    maxTime = max(targetEventTimes);
    diffTime = maxTime - minTime;
    calMatrix = [[0 for x in range(diffTime.days + 1)] for y in range(rowCount)]
    calMatrixOther = [[0 for x in range(diffTime.days + 1)] for y in range(rowCount)]

    print("{} x {}".format(len(calMatrix), len(calMatrix[0])))

    for time in sorted(targetEventTimes + otherEventTimes):
        day = time.day - minTime.day;     
        hour = time.hour;
        if((day >= (diffTime.days + 1) or hour >= rowCount)):
            continue;
        else:
            if(targetText in  dictOfTimeToEvent[time]["summary"].lower()):
                print(" MATRIX hour : {} day : {} at event {}" .format(hour, day, dictOfTimeToEvent[time]["summary"]));
                calMatrix[hour][day] = 1;
            else:
                print(" OTHER hour : {} day : {} at event {}" .format(hour, day, dictOfTimeToEvent[time]["summary"]));
                calMatrixOther[hour][day] = 1;
    
    return calMAtrix , calMatrixOther;

    pprint.pprint(calMatrix);
    plt.imshow(calMatrix);
    plt.title("calMAtrix")
    plt.show()
    plt.imshow(calMatrixOther);     
    plt.title("calMatrixOther")
    plt.show()


targetEvents, otherEvents = getListOfEvents(data, "gym")
targetMatrix, otherMatrix = getCalendarMatrix(targetEvents, otherEvents, "gym")




'''
1. List of events with tag and without tag
2. (Hour x Week) matrix -> (1) TargetEvents (gym) (2) errything else.
    - Matrix represents a FREE/BUSY status
    2019-03-04T11:00:00Z - 2019-03-07T11:00:00Z
3. 

'''        