# News Revealer

## AWS

```shell
aws configure sso
aws sso login
```

Copy profile `sso_*` lines from `~/.aws/config` to the correct section in `~/.aws/credentials`.

## Running the app

```shell
export AWS_PROFILE=...
export NEXT_PUBLIC_STAGE=dev
yarn
yarn dev
```
