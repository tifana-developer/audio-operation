#!/usr/bin/env bash

WORKSPACE_ROOT="/workspace"
TMP_WORKSPACE_ROOT="$HOME/.${WORKSPACE_ROOT##*/}"
SHELL_DIR=$(cd $(dirname $0) && pwd)
PROJECT_DIR=$(cd ${SHELL_DIR}/.. && pwd)
TMP_PROJECT_DIR=${TMP_WORKSPACE_ROOT}/${PROJECT_DIR##*${WORKSPACE_ROOT}/}

echo "📢  Variable information"
echo "------------------------------"
printf "\e[32;1mWORKSPACE_ROOT\e[m       : ${WORKSPACE_ROOT}\\n"
printf "\e[32;1mTMP_WORKSPACE_ROOT\e[m   : ${TMP_WORKSPACE_ROOT}\\n"
printf "\e[32;1mHOST_PWD\e[m             : ${HOST_PWD}\\n"
printf "\e[32;1mPWD\e[m                  : ${PWD}\\n"
printf "\e[32;1mSHELL_DIR\e[m            : ${SHELL_DIR}\\n"
printf "\e[32;1mPROJECT_DIR\e[m          : ${PROJECT_DIR}\\n"
printf "\e[32;1mTMP_PROJECT_DIR\e[m      : ${TMP_PROJECT_DIR}\\n"
printf "\e[32;1mPROJECT_NAME\e[m         : ${PROJECT_DIR##*/}\\n"
printf "\e[32;1mPROJECT_NODE_MODULES\e[m : ${PROJECT_DIR}/node_modules\\n"
echo "------------------------------"

# 共通関数の読み込み
filename="${SHELL_DIR}/functions.sh"
[ -f ${filename} ] || abort "🔥  E: no such file, ${filename}"
source ${filename}

# ローカル環境用にキャッシュするディレクトリを列挙する
declare -a array=(
  'node_modules'
  #'docs-cjs'
  #'docs-esm'
  'dist'
  '.cache'
)

# ローカル環境用にキャッシュするディレクトリにシンボリックリンクを貼る
if [ -e ${TMP_PROJECT_DIR} ]; then rm -rf ${TMP_PROJECT_DIR}; fi \
  && for d in ${array[@]}; do (rm -rf ${PROJECT_DIR}/$d); done \
  && for d in ${array[@]}; do (mkdir -p ${TMP_PROJECT_DIR}/$d); done \
  && for d in ${array[@]}; do (ln -s ${TMP_PROJECT_DIR}/$d ${PROJECT_DIR}/$d); done \
  && ls -la --color=always | grep '^l'

if [ -e ${TMP_WORKSPACE_ROOT}/lint ]; then rm -rf ${TMP_WORKSPACE_ROOT}/lint; fi \
  && mkdir -p ${TMP_WORKSPACE_ROOT}/lint \
  && ln -s ${TMP_PROJECT_DIR}/node_modules ${TMP_WORKSPACE_ROOT}/lint
