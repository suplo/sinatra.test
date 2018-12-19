/**
 * history.back()による遷移にてonloadが発火しないブラウザ（FF,Safari）向けの共通スクリプト
 */
window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};
