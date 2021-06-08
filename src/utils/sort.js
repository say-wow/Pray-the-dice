import i18next from 'i18next';

export const dynamicSortWithTraduction = (property, prefixTrad) => {
    var sortOrder = 1;
    return function (a,b) {
        if(sortOrder === -1){
          if(prefixTrad) {
            return i18next.t(`${prefixTrad}.${b[property]}`).localeCompare(i18next.t(`${prefixTrad}.${a[property]}`));
          }
          return b[property].localeCompare(a[property]);
        }else{
          if(prefixTrad) {
            return i18next.t(`${prefixTrad}.${a[property]}`).localeCompare(i18next.t(`${prefixTrad}.${b[property]}`));
          }
          return i18next.t(`skills.${a[property]}`).localeCompare(i18next.t(`skills.${b[property]}`));
        }        
    }
}