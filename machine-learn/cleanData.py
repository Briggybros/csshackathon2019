import datetime
import dateutil.parser as dp

data = {}
rowCount = 24
colCount = 7


def getListOfEvents(data, targetText):
    listOfTargetEvents = []
    listOfOtherEvents = []
    for event in data["items"]:
        thisEventDesc = event.get('summary', '')
        if(targetText in thisEventDesc.lower()):
            listOfTargetEvents.append(event)
        else:
            listOfOtherEvents.append(event)
    return listOfTargetEvents, listOfOtherEvents


def getCalendarMatrix(listOfTargetEvents, listOfOtherEvents, targetText):
    dictOfTimeToEvent = {}

    targetEventTimes = [dp.parse(event["start"]["dateTime"])
                        for event in listOfTargetEvents if "start" in event and "dateTime" in event["start"]]
    otherEventTimes = [dp.parse(event["start"]["dateTime"])
                       for event in listOfOtherEvents if "start" in event and "dateTime" in event["start"]]
    combined = listOfTargetEvents + listOfOtherEvents
    combined = [x for x in combined if "start" in x and "dateTime" in x["start"]]
    for ind, event in enumerate(combined):
        dateTime = event["start"]["dateTime"]
        pyDT = dp.parse(dateTime)
        event["start"]["dateTime"] = pyDT
        dictOfTimeToEvent[pyDT] = event

    minTime = min(targetEventTimes)
    minTime = minTime.replace(hour=0, minute=0, second=0, microsecond=0)
    maxTime = max(targetEventTimes)
    diffTime = maxTime - minTime
    calMatrix = [[0 for x in range(diffTime.days + 1)]
                 for y in range(rowCount)]
    calMatrixOther = [[0 for x in range(diffTime.days + 1)]
                      for y in range(rowCount)]

    for time in sorted(targetEventTimes + otherEventTimes):
        day = time.day - minTime.day
        hour = time.hour
        if((day >= (diffTime.days + 1) or hour >= rowCount)):
            continue
        else:
            if(targetText in dictOfTimeToEvent[time].get("summary", '').lower()):
                calMatrix[hour][day] = 1
            else:
                calMatrixOther[hour][day] = 1

    return calMatrix, calMatrixOther, minTime.weekday(), minTime
