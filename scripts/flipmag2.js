/**
 *   Copyright (c) 2016, Peter Johnson
 *   All rights reserved.
 *
 *   Redistribution and use in source and binary forms, with or without
 *   modification, are permitted provided that the following conditions are met:
 *
 *    * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 *    * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 *    * Neither the name of [project] nor the names of its
 *   contributors may be used to endorse or promote products derived from
 *   this software without specific prior written permission.
 *
 *   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 *   AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *   IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 *   DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 *   FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 *   DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 *   SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 *   CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 *   OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 *   OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
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