import i18next from 'i18next';

export const dynamicSortWithTraduction = (property, prefixTrad) => {
    var sortOrder = 1;
    return function (a,b) {
      if(!a.isCustom && prefixTrad) {
        a.tradLabel = i18next.t(`${prefixTrad}.${a[property]}`)
      } else {
        a.tradLabel = a[property];
      }
      if(!b.isCustom && prefixTrad) {
        b.tradLabel = i18next.t(`${prefixTrad}.${b[property]}`)
      } else {
        b.tradLabel = b[property];
      }
      if(sortOrder === -1){
        return b.tradLabel.localeCompare(a.tradLabel);
      }else{
        return a.tradLabel.localeCompare(b.tradLabel);
      }        
    }
}