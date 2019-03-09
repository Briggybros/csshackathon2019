import tensorflow as tf
import numpy as np
from datetime import datetime, timedelta
from flask import jsonify

from cleanData import getCalendarMatrix, getListOfEvents

model = tf.keras.models.load_model('model.h5')


def hello_world(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """

    request_json = request.get_json()
    if (request_json):
        print(request_json)
        schedules = request_json['schedules']
        calendar = request_json['calendar']

        preferred_days = schedules[0]['preferredDays']
        start = schedules[0]['preferredHours']['start']
        end = schedules[0]['preferredHours']['end']
        name = schedules[0]['name']

        targetEvents, otherEvents = getListOfEvents(calendar, name)
        targetMatrix, otherMatrix, offset_day_week, min_datetime = getCalendarMatrix(
            targetEvents, otherEvents, name)

        text_to_index = {
            "monday": 0,
            "tuesday": 1,
            "wednesday": 2,
            "thursday": 3,
            "friday": 4,
            "saturday": 5,
            "sunday": 6
        }

        span = end - start + 7
        preferred_days = [text_to_index[i] for i in preferred_days]
        d = [
            i + offset_day_week for i in range(span - offset_day_week) if i % 7 in preferred_days]
        a = np.zeros((24, span, 3))
        for i in d:
            a[list(range(start, end)), i, 1] = 1
        a[:, range(np.shape(otherMatrix)[1]), 0] = otherMatrix
        a[:, range(np.shape(targetMatrix)[1]), 2] = targetMatrix

        res = model.predict(np.array(a)[tf.newaxis, ...])
        res = res[0]
        res = res.reshape((res.shape[0], res.shape[1]))

        mask = a[:, :, 0]

        mask = -(mask - 1)
        res = res * mask

        days = np.unique(np.nonzero(a[:, :, 1])[1])
        m = res[:, days].argmax(axis=0)

        changed_days = np.zeros((a.shape[1]))
        changed_days[-7:] = 1
        greens = np.zeros((a.shape[1]))
        greens[days] = 1

        changed_days = np.where((greens == 1) & (changed_days == 1))[0]

        times = [min_datetime + timedelta(days=int(i)) for i in changed_days]
        m = [timedelta(hours=int(i))
             for i in res[:, changed_days].argmax(axis=0)]
        for i in range(len(times)):
            times[i] = times[i] + m[i]
        times = [time.timestamp() for time in times]
        stuff = [{"name": name, "datetime": timestamp*1000,
                  "duration": 60, "done": False} for timestamp in times]
        print(stuff)
        return jsonify(stuff)
    else:
        return "Hello World!"
