import pandas as pd
import json
import urllib.request
import mysql.connector
import requests

config = {
  "host": "jos-test.c4ztbtstxmqe.us-east-1.rds.amazonaws.com",
  "user": "admin",
  "password": "Jerome2020",
  "database": "FilmCritic"
}


df1 = pd.read_csv('./tmdb_5000_credits.csv', header=None, encoding="ISO-8859-1")
tmdb_key = '76baefc4c4555dd67c15a418d375c1f2'
image_url = 'https://image.tmdb.org/t/p/original'
get_poster_url = 'https://api.themoviedb.org/3/movie/{0}/images?api_key=76baefc4c4555dd67c15a418d375c1f2'
get_profile_url  = 'https://api.themoviedb.org/3/person/{0}/images?api_key=76baefc4c4555dd67c15a418d375c1f2'

# df2 = pd.read_csv('./tmdb_5000_movies.csv', header=None, encoding="ISO-8859-1")

# table = pd.read_table('./tmdb_5000_credits.csv', sep=",")

def download_image_film(img_url, index):
    print("downloading movie poster from: " + img_url)
    urllib.request.urlretrieve(img_url, './posters/' + str(index) + '.jpg')

def download_image_actor(img_url, name):
    print("downloading actor profile from: " + img_url)
    urllib.request.urlretrieve(img_url, './actors/' + name + '.jpg')



i = 0
for _, row in df1.iterrows():
    mydb = mysql.connector.connect(**config)
    mydb.autocommit = True
    cursor = mydb.cursor()

    if i == 0: # skip first row (just column names)
        i += 1
        continue

    if i == 702:
        break
        
    tmdb_id = row[0]
    try:
        poster_payload = requests.get(get_poster_url.format(tmdb_id)).json()['posters'][0]['file_path']
        # print(image_url + poster_payload)
        download_image_film(image_url + poster_payload, i)
        poster_url = str(i) + '.jpg'
    except Exception:
        poster_url = ''

    # print(tmdb_id)
    film = row[1]
    # print(film)
    # print(actor_roles)
    director = [entry['name'] for entry in json.loads(row[3]) if entry['job'] == 'Director'][0].split(' ')
    # print(director)

    try:

        cursor.execute('CALL AddFilmWithDirector("{0}", "{1}", "{2}", "{3}")'.format(director[0], director[1], film, poster_url))

        actor_roles = [(entry['name'], entry['character'], entry['id']) for entry in json.loads(row[2])]
        # print(actor_roles[0])
        try:
            film_id = cursor.fetchall()[0][0]
            
            # print(film_id)


            # mydb = mysql.connector.connect(**config)
            j = 0
            for actor in actor_roles:
                if j == 5:
                    break
                mydb = mysql.connector.connect(**config)
                mydb.autocommit = True
                cursor = mydb.cursor()
                actor_name = [name.replace('"', '') for name in actor[0].split(' ')]
                print("adding: ", str(actor_name))
                actor_role = actor[1].replace('"', '')
                actor_id = actor[2]
                try:
                    profile_payload = requests.get(get_profile_url.format(actor_id)).json()['profiles'][0]['file_path']
                    # print(image_url + profile_payload)
                    download_image_actor(image_url + profile_payload, actor_name[0] + '_' + actor_name[1])
                    profile_url = actor_name[0] + '_' + actor_name[1] + '.jpg'
                except Exception:
                    profile_url = ''

                cursor.execute('CALL AddCastMember({0}, "{1}", "{2}", "{3}", "{4}")'.format(film_id, actor_name[0], actor_name[1], actor_role, profile_url), multi=True)
                cursor.fetchall()
                j += 1
            

        except Exception: 
            print('no film to add to')
        i += 1

    except Exception:
        print('no director to add, skipping film')
    # print(director)
    # i += 1
    # if i == 4:
    #     break


