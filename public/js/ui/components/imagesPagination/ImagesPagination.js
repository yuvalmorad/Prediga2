component.ImagesPagination = (function(){
    return React.createClass({
        getInitialState: function() {
            return {
                currentIndex: 0
            }
        },

        render: function(){
            var props = this.props;
            var items = props.items;
            var itemsElements = items.map(function(item){
                var isSelected = item.isSelected;
                var logo = item.logo;
                var logoGray = item.logoGray;
                var title = item.title;
                var id = item.id;
                var src = isSelected ? logo : logoGray;

                return re("div", {key: id, className: "item"},
                    re("img", {src: "../images/teamsLogo/" + src}),
                    re("div", {}, title)
                );

            });

            return re("div", {className: "images-pagination"},
                re("div", {className: "scroll"},
                    itemsElements
                )
            );
        }
    });
})();


