document.addEventListener('DOMContentLoaded', function () {
    "use strict";
    var url = window.location.href;
    var path = url.replace(window.location.origin + "/", "");
    var elements = Array.prototype.slice.call(document.querySelectorAll('ul#sidebarnav a'));
    var element = elements.filter(function (el) {
        return el.href === url || el.getAttribute('href') === path;
    })[0];

    if (element) {
        var parents = [];
        var parent = element.parentElement;
        while (parent && parent !== document.body) {
            parents.unshift(parent); // Add to the beginning of the array
            parent = parent.parentElement;
        }

        parents.forEach(function (parent) {
            if (parent.tagName.toLowerCase() === 'li' && parent.children.length !== 0) {
                parent.children[0].classList.add('active');
                if (parent.parentElement.id !== 'sidebarnav') {
                    parent.classList.add('active');
                } else {
                    parent.classList.add('selected');
                }
            } else if (parent.tagName.toLowerCase() !== 'ul' && parent.children.length === 0) {
                parent.classList.add('selected');
            } else if (parent.tagName.toLowerCase() === 'ul') {
                parent.classList.add('in');
            }
        });

        element.classList.add('active');
    }

    document.querySelectorAll('#sidebarnav a').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var active = this.classList.contains('active');
            if (!active) {
                var ul = this.closest('ul');
                if (ul) {
                    var inElements = ul.querySelectorAll('ul.in');
                    Array.prototype.forEach.call(inElements, function (el) {
                        el.classList.remove('in');
                    });
                    var activeElements = ul.querySelectorAll('a.active');
                    Array.prototype.forEach.call(activeElements, function (el) {
                        el.classList.remove('active');
                    });
                }
                var nextUl = this.nextElementSibling;
                if (nextUl && nextUl.tagName.toLowerCase() === 'ul') {
                    nextUl.classList.add('in');
                }
                this.classList.add('active');
            } else {
                this.classList.remove('active');
                var parentUl = this.closest('ul');
                if (parentUl) {
                    parentUl.classList.remove('active');
                }
                var nextUl = this.nextElementSibling;
                if (nextUl && nextUl.tagName.toLowerCase() === 'ul') {
                    nextUl.classList.remove('in');
                }
            }
        });
    });

    document.querySelectorAll('#sidebarnav > li > a.has-arrow').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
        });
    });
});