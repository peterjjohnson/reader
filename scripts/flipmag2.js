var flipmag = flipmag || {};
(function($) {
	flipmag = function(wrapperEl, displayNum, index) {
		this.wrapperEl = wrapperEl;
		this.displayNum = displayNum ? displayNum : 2;
		this.page = new Array();
		this.index = index ? index : 0;
		this.clicks = 0;
		var pages = wrapperEl.children(),
			j = 0,
			k = 0;
		//Wrap child elements
		for (var i = 0; i < pages.length; i++) {
			if (!this.page[j]) {
				this.page[j] = new Array();
			}
			var page = $(pages[i]),
				self = this,
				thisPage = i + 1;
			page.replaceWith($('<div />').attr('id', 'flipmag-p-' + thisPage).addClass('flipmag-page'));
			$('#flipmag-p-' + thisPage).append(page).addClass('display-' + displayNum);
			if (this.displayNum > 1) {
				$('#flipmag-p-' + thisPage).bind('click.flipmag', function (e) {
					var p = (e.currentTarget || e.target).id.match(/\d+/)[0] * 1;
					self.pageTurn(p % 2 == 0 ? 'prev' : 'next');
				});
			}
			else {
				$('#flipmag-p-' + thisPage).bind('click.flipmag', function (e) {
					if (self.clicks == 0) {
						self.clicks = 1;
						setTimeout(function () {
							self.clicks = 0;
							self.pageTurn('next');
						}, 50);
					}
					else {
						self.pageTurn('prev');
					}
				});
			}
			this.page[j][k] = $('#flipmag-p-' + thisPage);
			if (i > 0 && k < this.displayNum - 1) {
				k++;
			}
			else {
				k = 0;
				j++;
			}
		}
		this.setIndex(this.index)
	}

	flipmag.prototype.onPageTurn = function (index) {
	}

	flipmag.prototype.setIndex = function (index) {
		$('.flipmag-page').hide();
		for (var k in this.page[index]) {
			this.page[index][k].show();
		}
		this.index = index;
		this.onPageTurn(index);
	}

	flipmag.prototype.pageTurn = function (direction) {
		var newIndex = this.index;
		switch (direction) {
			case 'next':
				if (this.index < this.page.length - 1) {
					newIndex += 1;
				}
				else {
					newIndex = 0;
				}
				break;
			case 'prev':
				if (this.index > 0) {
					newIndex -= 1;
				}
				else {
					newIndex = this.page.length - 1;
				}
				break;
		}
		this.setIndex(newIndex);
	}
})(jQuery);