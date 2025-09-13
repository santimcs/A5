```python
import pandas as pd

# https://files.grouplens.org/datasets/movielens/ml-25m.zip
movies = pd.read_csv("movies.csv")
```


```python
movies.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>movieId</th>
      <th>title</th>
      <th>genres</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>Toy Story (1995)</td>
      <td>Adventure|Animation|Children|Comedy|Fantasy</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>Jumanji (1995)</td>
      <td>Adventure|Children|Fantasy</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>Grumpier Old Men (1995)</td>
      <td>Comedy|Romance</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>Waiting to Exhale (1995)</td>
      <td>Comedy|Drama|Romance</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>Father of the Bride Part II (1995)</td>
      <td>Comedy</td>
    </tr>
  </tbody>
</table>
</div>




```python
import re

def clean_title(title):
    title = re.sub("[^a-zA-Z0-9 ]", "", title)
    return title
```


```python
movies["clean_title"] = movies["title"].apply(clean_title)
```


```python
movies
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>movieId</th>
      <th>title</th>
      <th>genres</th>
      <th>clean_title</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>Toy Story (1995)</td>
      <td>Adventure|Animation|Children|Comedy|Fantasy</td>
      <td>Toy Story 1995</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>Jumanji (1995)</td>
      <td>Adventure|Children|Fantasy</td>
      <td>Jumanji 1995</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>Grumpier Old Men (1995)</td>
      <td>Comedy|Romance</td>
      <td>Grumpier Old Men 1995</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>Waiting to Exhale (1995)</td>
      <td>Comedy|Drama|Romance</td>
      <td>Waiting to Exhale 1995</td>
    </tr>
    <tr>
      <th>4</th>
      <td>5</td>
      <td>Father of the Bride Part II (1995)</td>
      <td>Comedy</td>
      <td>Father of the Bride Part II 1995</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>62418</th>
      <td>209157</td>
      <td>We (2018)</td>
      <td>Drama</td>
      <td>We 2018</td>
    </tr>
    <tr>
      <th>62419</th>
      <td>209159</td>
      <td>Window of the Soul (2001)</td>
      <td>Documentary</td>
      <td>Window of the Soul 2001</td>
    </tr>
    <tr>
      <th>62420</th>
      <td>209163</td>
      <td>Bad Poems (2018)</td>
      <td>Comedy|Drama</td>
      <td>Bad Poems 2018</td>
    </tr>
    <tr>
      <th>62421</th>
      <td>209169</td>
      <td>A Girl Thing (2001)</td>
      <td>(no genres listed)</td>
      <td>A Girl Thing 2001</td>
    </tr>
    <tr>
      <th>62422</th>
      <td>209171</td>
      <td>Women of Devil's Island (1962)</td>
      <td>Action|Adventure|Drama</td>
      <td>Women of Devils Island 1962</td>
    </tr>
  </tbody>
</table>
<p>62423 rows × 4 columns</p>
</div>




```python
from sklearn.feature_extraction.text import TfidfVectorizer
vectorizer = TfidfVectorizer(ngram_range=(1,2))

tfidf = vectorizer.fit_transform(movies["clean_title"])
```


```python
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def search(title):
    title = clean_title(title)
    query_vec = vectorizer.transform([title])
    similarity = cosine_similarity(query_vec, tfidf).flatten()
    indices = np.argpartition(similarity, -5)[-5:]
    results = movies.iloc[indices].iloc[::-1]
    
    return results
```


```python
import ipywidgets as widgets
from IPython.display import display

movie_input = widgets.Text(
    value='Toy Story',
    description='Movie Title:',
    disabled=False
)
movie_list = widgets.Output()

def on_type(data):
    with movie_list:
        movie_list.clear_output()
        title = data["new"]
        if len(title) > 5:
            display(search(title))

movie_input.observe(on_type, names='value')


display(movie_input, movie_list)
```


    Text(value='Toy Story', description='Movie Title:')



    Output()



```python
movie_id = 89745

#def find_similar_movies(movie_id):
movie = movies[movies["movieId"] == movie_id]
```


```python
ratings = pd.read_csv("ratings.csv")
```


```python
ratings.dtypes
```




    userId         int64
    movieId        int64
    rating       float64
    timestamp      int64
    dtype: object




```python
similar_users = ratings[(ratings["movieId"] == movie_id) & (ratings["rating"] > 4)]["userId"].unique()
```


```python
similar_user_recs = ratings[(ratings["userId"].isin(similar_users)) & (ratings["rating"] > 4)]["movieId"]
```


```python
similar_user_recs = similar_user_recs.value_counts() / len(similar_users)

similar_user_recs = similar_user_recs[similar_user_recs > .10]
```


```python
all_users = ratings[(ratings["movieId"].isin(similar_user_recs.index)) & (ratings["rating"] > 4)]
```


```python
all_user_recs = all_users["movieId"].value_counts() / len(all_users["userId"].unique())
```


```python
rec_percentages = pd.concat([similar_user_recs, all_user_recs], axis=1)
rec_percentages.columns = ["similar", "all"]
```


```python
rec_percentages
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>similar</th>
      <th>all</th>
    </tr>
    <tr>
      <th>movieId</th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>89745</th>
      <td>1.000000</td>
      <td>0.040459</td>
    </tr>
    <tr>
      <th>58559</th>
      <td>0.573393</td>
      <td>0.148256</td>
    </tr>
    <tr>
      <th>59315</th>
      <td>0.530649</td>
      <td>0.054931</td>
    </tr>
    <tr>
      <th>79132</th>
      <td>0.519715</td>
      <td>0.132987</td>
    </tr>
    <tr>
      <th>2571</th>
      <td>0.496687</td>
      <td>0.247010</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>47610</th>
      <td>0.103545</td>
      <td>0.022770</td>
    </tr>
    <tr>
      <th>780</th>
      <td>0.103380</td>
      <td>0.054723</td>
    </tr>
    <tr>
      <th>88744</th>
      <td>0.103048</td>
      <td>0.010383</td>
    </tr>
    <tr>
      <th>1258</th>
      <td>0.101226</td>
      <td>0.083887</td>
    </tr>
    <tr>
      <th>1193</th>
      <td>0.100895</td>
      <td>0.120244</td>
    </tr>
  </tbody>
</table>
<p>193 rows × 2 columns</p>
</div>




```python
rec_percentages["score"] = rec_percentages["similar"] / rec_percentages["all"]
```


```python
rec_percentages = rec_percentages.sort_values("score", ascending=False)
```


```python
rec_percentages.head(10).merge(movies, left_index=True, right_on="movieId")
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>similar</th>
      <th>all</th>
      <th>score</th>
      <th>movieId</th>
      <th>title</th>
      <th>genres</th>
      <th>clean_title</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>17067</th>
      <td>1.000000</td>
      <td>0.040459</td>
      <td>24.716368</td>
      <td>89745</td>
      <td>Avengers, The (2012)</td>
      <td>Action|Adventure|Sci-Fi|IMAX</td>
      <td>Avengers The 2012</td>
    </tr>
    <tr>
      <th>20513</th>
      <td>0.103711</td>
      <td>0.005289</td>
      <td>19.610199</td>
      <td>106072</td>
      <td>Thor: The Dark World (2013)</td>
      <td>Action|Adventure|Fantasy|IMAX</td>
      <td>Thor The Dark World 2013</td>
    </tr>
    <tr>
      <th>25058</th>
      <td>0.241054</td>
      <td>0.012367</td>
      <td>19.491770</td>
      <td>122892</td>
      <td>Avengers: Age of Ultron (2015)</td>
      <td>Action|Adventure|Sci-Fi</td>
      <td>Avengers Age of Ultron 2015</td>
    </tr>
    <tr>
      <th>19678</th>
      <td>0.216534</td>
      <td>0.012119</td>
      <td>17.867419</td>
      <td>102125</td>
      <td>Iron Man 3 (2013)</td>
      <td>Action|Sci-Fi|Thriller|IMAX</td>
      <td>Iron Man 3 2013</td>
    </tr>
    <tr>
      <th>16725</th>
      <td>0.215043</td>
      <td>0.012052</td>
      <td>17.843074</td>
      <td>88140</td>
      <td>Captain America: The First Avenger (2011)</td>
      <td>Action|Adventure|Sci-Fi|Thriller|War</td>
      <td>Captain America The First Avenger 2011</td>
    </tr>
    <tr>
      <th>16312</th>
      <td>0.175447</td>
      <td>0.010142</td>
      <td>17.299824</td>
      <td>86332</td>
      <td>Thor (2011)</td>
      <td>Action|Adventure|Drama|Fantasy|IMAX</td>
      <td>Thor 2011</td>
    </tr>
    <tr>
      <th>21348</th>
      <td>0.287608</td>
      <td>0.016737</td>
      <td>17.183667</td>
      <td>110102</td>
      <td>Captain America: The Winter Soldier (2014)</td>
      <td>Action|Adventure|Sci-Fi|IMAX</td>
      <td>Captain America The Winter Soldier 2014</td>
    </tr>
    <tr>
      <th>25071</th>
      <td>0.214049</td>
      <td>0.012856</td>
      <td>16.649399</td>
      <td>122920</td>
      <td>Captain America: Civil War (2016)</td>
      <td>Action|Sci-Fi|Thriller</td>
      <td>Captain America Civil War 2016</td>
    </tr>
    <tr>
      <th>25061</th>
      <td>0.136017</td>
      <td>0.008573</td>
      <td>15.865628</td>
      <td>122900</td>
      <td>Ant-Man (2015)</td>
      <td>Action|Adventure|Sci-Fi</td>
      <td>AntMan 2015</td>
    </tr>
    <tr>
      <th>14628</th>
      <td>0.242876</td>
      <td>0.015517</td>
      <td>15.651921</td>
      <td>77561</td>
      <td>Iron Man 2 (2010)</td>
      <td>Action|Adventure|Sci-Fi|Thriller|IMAX</td>
      <td>Iron Man 2 2010</td>
    </tr>
  </tbody>
</table>
</div>




```python
def find_similar_movies(movie_id):
    similar_users = ratings[(ratings["movieId"] == movie_id) & (ratings["rating"] > 4)]["userId"].unique()
    similar_user_recs = ratings[(ratings["userId"].isin(similar_users)) & (ratings["rating"] > 4)]["movieId"]
    similar_user_recs = similar_user_recs.value_counts() / len(similar_users)

    similar_user_recs = similar_user_recs[similar_user_recs > .10]
    all_users = ratings[(ratings["movieId"].isin(similar_user_recs.index)) & (ratings["rating"] > 4)]
    all_user_recs = all_users["movieId"].value_counts() / len(all_users["userId"].unique())
    rec_percentages = pd.concat([similar_user_recs, all_user_recs], axis=1)
    rec_percentages.columns = ["similar", "all"]
    
    rec_percentages["score"] = rec_percentages["similar"] / rec_percentages["all"]
    rec_percentages = rec_percentages.sort_values("score", ascending=False)
    return rec_percentages.head(10).merge(movies, left_index=True, right_on="movieId")[["score", "title", "genres"]]
```


```python
import ipywidgets as widgets
from IPython.display import display

movie_name_input = widgets.Text(
    value='Toy Story',
    description='Movie Title:',
    disabled=False
)
recommendation_list = widgets.Output()

def on_type(data):
    with recommendation_list:
        recommendation_list.clear_output()
        title = data["new"]
        if len(title) > 5:
            results = search(title)
            movie_id = results.iloc[0]["movieId"]
            display(find_similar_movies(movie_id))

movie_name_input.observe(on_type, names='value')

display(movie_name_input, recommendation_list)
```


    Text(value='Toy Story', description='Movie Title:')



    Output()



```python

```


```python

```
