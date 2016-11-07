# めんちゃ

Cloud 感情セイスモグラム 😀 😐 😲 😫

## 動かし方

1. firebase でプロジェクトを作る
1. `.env` を root ディレクトリ (package.json があるディレクトリ)に作る
1. `npm install`
1. `npm start`

### `.env` の中身

作成した firebase のプロジェクトの情報で `<your hoge>` の部分を埋めます.

```
REACT_APP_FIREBASE_API_KEY=<your firebase api key>
REACT_APP_FIREBASE_AUTH_DOMAIN=<your firebase auth domain>
REACT_APP_FIREBASE_DATABASE_URL=<your firebase database url>
REACT_APP_FIREBASE_STORAGE_BUCKET=<your firebase storage bucket>
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your firebase messaging sender id>
```
### `.firebaserc`

自分の firebase project にデプロイする際には `.firebaserc` を root ディレクトリに作って以下の json を書いておくとプロジェクトの指定をする手間が省けます.

````json
{
  "projects": {
    "default": "<your project id>"
  }
}
```
