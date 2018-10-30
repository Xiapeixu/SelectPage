type Callback = (...args: any[]) => any;

interface Ielem {
	combo_input: JQuery<Element>;
	container: JQuery<Element>;
	button: JQuery<HTMLElement>;
	dropdown: JQuery<HTMLElement>;
	clear_btn: JQuery<HTMLElement>;
	element_box: JQuery<HTMLElement>;
	control: JQuery<HTMLElement>;
	result_area: JQuery<HTMLElement>;
	navi: JQuery<HTMLElement>;
	results: JQuery<HTMLElement>;
	hidden: JQuery<HTMLElement>;
	control_text: JQuery<HTMLElement>;
}

interface Iprop {
	first_show: boolean,
	page_move: boolean,
	disabled: boolean,
	current_page: number,
	max_page: number,
	is_loading: boolean,
	xhr: boolean,
	key_paging: boolean,
	key_select: boolean,
	// last selected item value
	prev_value: string,
	// last selected item text
	selected_text: string,
	last_input_time: number,
	init_set: boolean
};

interface IselectPage {
	data: string | Array<{}>;
	lang: string;
	multiple: boolean;
	pagination: boolean;
	dropButton: boolean;
	listSize: number;
	multipleControlbar: boolean;
	maxSelectLimit: number;
	selectToCloseList: boolean;
	initRecord: string | number | string[];
	dbTable: string;
	keyField: string;
	showField: string;
	searchField: string;
	andOr: string;
	orderBy: Array<{}> | boolean;
	pageSize: number;
	params: () => object;
	formatItem: () => object;
	autoFillResult: boolean;
	autoSelectFirst: boolean;
	noResultClean: boolean;
	selectOnly: boolean;
	inputDelay: number;
	version: string;
	datakey: string;
	message: {
		add_btn: string,
		add_title: string,
		del_btn: string,
		del_title: string,
		next: string,
		next_title: string,
		prev: string,
		prev_title: string,
		first_title: string,
		last_title: string,
		get_all_btn: string,
		get_all_alt: string,
		close_btn: string,
		close_alt: string,
		loading: string,
		loading_alt: string,
		page_info: string,
		select_ng: string,
		select_ok: string,
		not_found: string,
		ajax_error: string,
		clear: string,
		select_all: string,
		unselect_all: string,
		clear_all: string,
		max_selected: string
	};
	css_class: {
		container: string,
		container_open: string,
		re_area: string,
		result_open: string,
		control_box: string,
		element_box: string,
		navi: string,
		results: string,
		re_off: string,
		select: string,
		select_ok: string,
		select_ng: string,
		selected: string,
		input_off: string,
		message_box: string,
		disabled: string,

		button: string,
		caret_open: string,
		btn_on: string,
		btn_out: string,
		input: string,
		clear_btn: string,
		align_right: string
	};

	template: {
		tag: {
			content: string,
			textKey: string,
			valueKey: string
		},
		page: {
			current: string,
			total: string
		},
		msg: {
			maxSelectLimit: string
		}
	};

	// Events
	eSelect: Callback;
	eOpen: Callback;
	eAjaxSuccess: Callback;
	eTagRemove: Callback;
	eClear: Callback;
}

export class select {
	public option: IselectPage;
	public elem: Ielem;
	public prop: Iprop;
	public eSelect: Callback = null;
	public eOpen: Callback = null;
	public eAjaxSuccess: Callback = null;
	public eTagRemove: Callback = null;
	public eClear: Callback = null;
	public selectPage = ((input: Element, opcion: IselectPage) => {
		this.option.version = '2.19';
		this.option.datakey = 'selectPageObject';
		this.setOption(opcion);
		this.setLanguage();
		this.setCssClass();
		this.setProp();
		this.setElem(input);

		this.setButtonAttrDefault();
		this.setInitRecord(true);

		this.eDropdownButton();
		this.eInput();
		this.eWhole();
	});

	private setOption(option: IselectPage) {
		option.searchField = option.searchField || option.showField;

		option.andOr = option.andOr.toUpperCase();
		if (option.andOr !== 'AND' && option.andOr !== 'OR') option.andOr = 'AND';

		const arr = ['searchField'];
		arr.forEach((_item: string, i: number) => {
			option[arr[i]] = this.strToArray(option[arr[i]]);
		})

		if (option.orderBy !== false) option.orderBy = this.setOrderbyOption(option.orderBy, option.showField);
		if (option.multiple && !option.selectToCloseList) {
			option.autoFillResult = false;
			option.autoSelectFirst = false;
		}
		if (!option.pagination) option.pageSize = 200;
		if ($.type(option.listSize) !== 'number' || option.listSize < 0) option.listSize = 10;
		this.option = option;
	};

	private strToArray(str) {
		return str ? str.replace(/[\s　]+/g, '').split(',') : '';
	};

	private setOrderbyOption(arg_order, arg_field) {
		var arr = [], orders = [];
		if (typeof arg_order === 'object') {
			for (var i = 0; i < arg_order.length; i++) {
				orders = $.trim(arg_order[i]).split(' ');
				if (orders.length) arr.push((orders.length === 2) ? orders.concat() : [orders[0], 'ASC']);
			}
		} else {
			orders = $.trim(arg_order).split(' ');
			arr[0] = (orders.length === 2) ? orders.concat() : (orders[0].toUpperCase().match(/^(ASC|DESC)$/i)) ? [arg_field, orders[0].toUpperCase()] : [orders[0], 'ASC'];
		}
		return arr;
	};

	/**
	 * i18n
	 */
	private setLanguage() {
		var message, p = this.option;
		switch (p.lang) {
			// German
			case 'de':
				message = {
					add_btn: 'Hinzufügen-Button',
					add_title: 'Box hinzufügen',
					del_btn: 'Löschen-Button',
					del_title: 'Box löschen',
					next: 'Nächsten',
					next_title: 'Nächsten' + p.pageSize + ' (Pfeil-rechts)',
					prev: 'Vorherigen',
					prev_title: 'Vorherigen' + p.pageSize + ' (Pfeil-links)',
					first_title: 'Ersten (Umschalt + Pfeil-links)',
					last_title: 'Letzten (Umschalt + Pfeil-rechts)',
					get_all_btn: 'alle (Pfeil-runter)',
					get_all_alt: '(Button)',
					close_btn: 'Schließen (Tab)',
					close_alt: '(Button)',
					loading: 'lade...',
					loading_alt: '(lade)',
					page_info: 'page_num von page_count',
					select_ng: 'Achtung: Bitte wählen Sie aus der Liste aus.',
					select_ok: 'OK : Richtig ausgewählt.',
					not_found: 'nicht gefunden',
					ajax_error: 'Bei der Verbindung zum Server ist ein Fehler aufgetreten.',
					clear: 'Löschen Sie den Inhalt',
					select_all: 'Wähle diese Seite',
					unselect_all: 'Diese Seite entfernen',
					clear_all: 'Alles löschen',
					max_selected: 'Sie können nur bis zu max_selected_limit Elemente auswählen'
				};
				break;

			// English
			case 'en':
				message = {
					add_btn: 'Add button',
					add_title: 'add a box',
					del_btn: 'Del button',
					del_title: 'delete a box',
					next: 'Next',
					next_title: 'Next' + p.pageSize + ' (Right key)',
					prev: 'Prev',
					prev_title: 'Prev' + p.pageSize + ' (Left key)',
					first_title: 'First (Shift + Left key)',
					last_title: 'Last (Shift + Right key)',
					get_all_btn: 'Get All (Down key)',
					get_all_alt: '(button)',
					close_btn: 'Close (Tab key)',
					close_alt: '(button)',
					loading: 'loading...',
					loading_alt: '(loading)',
					page_info: 'Page page_num of page_count',
					select_ng: 'Attention : Please choose from among the list.',
					select_ok: 'OK : Correctly selected.',
					not_found: 'not found',
					ajax_error: 'An error occurred while connecting to server.',
					clear: 'Clear content',
					select_all: 'Select current page',
					unselect_all: 'Clear current page',
					clear_all: 'Clear all selected',
					max_selected: 'You can only select up to max_selected_limit items'
				};
				break;

			// Spanish
			case 'es':
				message = {
					add_btn: 'Agregar boton',
					add_title: 'Agregar una opcion',
					del_btn: 'Borrar boton',
					del_title: 'Borrar una opcion',
					next: 'Siguiente',
					next_title: 'Proximas ' + p.pageSize + ' (tecla derecha)',
					prev: 'Anterior',
					prev_title: 'Anteriores ' + p.pageSize + ' (tecla izquierda)',
					first_title: 'Primera (Shift + Left)',
					last_title: 'Ultima (Shift + Right)',
					get_all_btn: 'Ver todos (tecla abajo)',
					get_all_alt: '(boton)',
					close_btn: 'Cerrar (tecla TAB)',
					close_alt: '(boton)',
					loading: 'Cargando...',
					loading_alt: '(Cargando)',
					page_info: 'page_num de page_count',
					select_ng: 'Atencion: Elija una opcion de la lista.',
					select_ok: 'OK: Correctamente seleccionado.',
					not_found: 'no encuentre',
					ajax_error: 'Un error ocurrió mientras conectando al servidor.',
					clear: 'Borrar el contenido',
					select_all: 'Elija esta página',
					unselect_all: 'Borrar esta página',
					clear_all: 'Borrar todo marcado',
					max_selected: 'Solo puedes seleccionar hasta max_selected_limit elementos'
				};
				break;

			// Brazilian Portuguese
			case 'pt-br':
				message = {
					add_btn: 'Adicionar botão',
					add_title: 'Adicionar uma caixa',
					del_btn: 'Apagar botão',
					del_title: 'Apagar uma caixa',
					next: 'Próxima',
					next_title: 'Próxima ' + p.pageSize + ' (tecla direita)',
					prev: 'Anterior',
					prev_title: 'Anterior ' + p.pageSize + ' (tecla esquerda)',
					first_title: 'Primeira (Shift + Left)',
					last_title: 'Última (Shift + Right)',
					get_all_btn: 'Ver todos (Seta para baixo)',
					get_all_alt: '(botão)',
					close_btn: 'Fechar (tecla TAB)',
					close_alt: '(botão)',
					loading: 'Carregando...',
					loading_alt: '(Carregando)',
					page_info: 'page_num de page_count',
					select_ng: 'Atenção: Escolha uma opção da lista.',
					select_ok: 'OK: Selecionado Corretamente.',
					not_found: 'não encontrado',
					ajax_error: 'Um erro aconteceu enquanto conectando a servidor.',
					clear: 'Limpe o conteúdo',
					select_all: 'Selecione a página atual',
					unselect_all: 'Remova a página atual',
					clear_all: 'Limpar tudo',
					max_selected: 'Você só pode selecionar até max_selected_limit itens'
				};
				break;

			// Japanese
			case 'ja':
				message = {
					add_btn: '追加ボタン',
					add_title: '入力ボックスを追加します',
					del_btn: '削除ボタン',
					del_title: '入力ボックスを削除します',
					next: '次へ',
					next_title: '次の' + p.pageSize + '件 (右キー)',
					prev: '前へ',
					prev_title: '前の' + p.pageSize + '件 (左キー)',
					first_title: '最初のページへ (Shift + 左キー)',
					last_title: '最後のページへ (Shift + 右キー)',
					get_all_btn: '全件取得 (下キー)',
					get_all_alt: '画像:ボタン',
					close_btn: '閉じる (Tabキー)',
					close_alt: '画像:ボタン',
					loading: '読み込み中...',
					loading_alt: '画像:読み込み中...',
					page_info: 'page_num 件 (全 page_count 件)',
					select_ng: '注意 : リストの中から選択してください',
					select_ok: 'OK : 正しく選択されました。',
					not_found: '(0 件)',
					ajax_error: 'サーバとの通信でエラーが発生しました。',
					clear: 'コンテンツをクリアする',
					select_all: '当ページを選びます',
					unselect_all: '移して当ページを割ります',
					clear_all: '選択した項目をクリアする',
					max_selected: '最多で max_selected_limit のプロジェクトを選ぶことしかできません'
				};
				break;
			// 中文
			case 'cn':
			default:
				message = {
					add_btn: '添加按钮',
					add_title: '添加区域',
					del_btn: '删除按钮',
					del_title: '删除区域',
					next: '下一页',
					next_title: '下' + p.pageSize + ' (→)',
					prev: '上一页',
					prev_title: '上' + p.pageSize + ' (←)',
					first_title: '首页 (Shift + ←)',
					last_title: '尾页 (Shift + →)',
					get_all_btn: '获得全部 (↓)',
					get_all_alt: '(按钮)',
					close_btn: '关闭 (Tab键)',
					close_alt: '(按钮)',
					loading: '读取中...',
					loading_alt: '(读取中)',
					page_info: '第 page_num 页(共page_count页)',
					select_ng: '请注意：请从列表中选择.',
					select_ok: 'OK : 已经选择.',
					not_found: '无查询结果',
					ajax_error: '连接到服务器时发生错误！',
					clear: '清除内容',
					select_all: '选择当前页项目',
					unselect_all: '取消选择当前页项目',
					clear_all: '清除全部已选择项目',
					max_selected: '最多只能选择 max_selected_limit 个项目'
				};
				break;
		}
		this.option.message = message;
	};


	private setCssClass() {
		const css_class = {
			container: 'sp_container',
			container_open: 'sp_container_open',
			re_area: 'sp_result_area',
			result_open: 'sp_result_area_open',
			control_box: 'sp_control_box',
			//multiple select mode
			element_box: 'sp_element_box',
			navi: 'sp_navi',
			//result list
			results: 'sp_results',
			re_off: 'sp_results_off',
			select: 'sp_over',
			select_ok: 'sp_select_ok',
			select_ng: 'sp_select_ng',
			selected: 'sp_selected',
			input_off: 'sp_input_off',
			message_box: 'sp_message_box',
			disabled: 'sp_disabled',

			button: 'sp_button',
			caret_open: 'sp_caret_open',
			btn_on: 'sp_btn_on',
			btn_out: 'sp_btn_out',
			input: 'sp_input',
			clear_btn: 'sp_clear_btn',
			align_right: 'sp_align_right'
		};
		this.option.css_class = css_class;
	};

	private setProp() {
		this.prop = {
			//input disabled status
			first_show: true,
			page_move: false,
			disabled: false,
			current_page: 1,
			//total page
			max_page: 1,
			//ajax data loading status
			is_loading: false,
			xhr: false,
			key_paging: false,
			key_select: false,
			//last selected item value
			prev_value: '',
			//last selected item text
			selected_text: '',
			last_input_time: undefined,
			init_set: false
		};
		this.option.template = {
			tag: {
				content: '<li class="selected_tag" itemvalue="#item_value#">#item_text#<span class="tag_close"><i class="sp-iconfont if-close"></i></span></li>',
				textKey: '#item_text#',
				valueKey: '#item_value#'
			},
			page: {
				current: 'page_num',
				total: 'page_count'
			},
			msg: {
				maxSelectLimit: 'max_selected_limit'
			}
		};
	};

	private elementRealSize(element, method) {
		var defaults = {
			absolute: false,
			clone: false,
			includeMargin: false,
			display: 'block'
		};
		var configs = defaults, $target = element.eq(0), fix, restore, tmp = [], style = '', $hidden;

		fix = function () {
			// get all hidden parents
			$hidden = $target.parents().addBack().filter(':hidden');
			style += 'visibility: hidden !important; display: ' + configs.display + ' !important; ';

			if (configs.absolute === true) style += 'position: absolute !important;';

			// save the origin style props
			// set the hidden el css to be got the actual value later
			$hidden.each(function () {
				// Save original style. If no style was set, attr() returns undefined
				var $this = $(this), thisStyle = $this.attr('style');
				tmp.push(thisStyle);
				// Retain as much of the original style as possible, if there is one
				$this.attr('style', thisStyle ? thisStyle + ';' + style : style);
			});
		};

		restore = function () {
			// restore origin style values
			$hidden.each(function (i) {
				var $this = $(this), _tmp = tmp[i];

				if (_tmp === undefined) $this.removeAttr('style');
				else $this.attr('style', _tmp);
			});
		};

		fix();
		// get the actual value with user specific methed
		// it can be 'width', 'height', 'outerWidth', 'innerWidth'... etc
		// configs.includeMargin only works for 'outerWidth' and 'outerHeight'
		var actual = /(outer)/.test(method) ?
			$target[method](configs.includeMargin) :
			$target[method]();

		restore();
		// IMPORTANT, this plugin only return the value of the first element
		return actual;
	};


	private setElem(combo_input: Element) {
		// 1. build Dom object
		var elem = {} as Ielem, p = this.option, css = this.option.css_class, msg = this.option.message, input = $(combo_input);
		var orgWidth = input.outerWidth();
		// fix input width in hidden situation
		if (orgWidth <= 0) orgWidth = this.elementRealSize(input, 'outerWidth');
		if (orgWidth < 150) orgWidth = 150;

		elem.combo_input = input.attr({ 'autocomplete': 'off' }).addClass(css.input).wrap('<div>');
		if (p.selectOnly) elem.combo_input.prop('readonly', true);
		elem.container = elem.combo_input.parent().addClass(css.container);
		if (elem.combo_input.prop('disabled')) {
			if (p.multiple) elem.container.addClass(css.disabled);
			else elem.combo_input.addClass(css.input_off);
		}

		// set outer box width
		elem.container.width(orgWidth);

		elem.button = $('<div>').addClass(css.button);
		//drop down button
		elem.dropdown = $('<span class="sp_caret"></span>');
		//clear button 'X' in single mode
		elem.clear_btn = $('<div>').html(($('<i>').addClass('sp-iconfont if-close') as any)).addClass(css.clear_btn).attr('title', msg.clear);
		if (!p.dropButton) elem.clear_btn.addClass(css.align_right);

		//main box in multiple mode
		elem.element_box = $('<ul>').addClass(css.element_box);
		if (p.multiple && p.multipleControlbar)
			elem.control = $('<div>').addClass(css.control_box);
		//result list box
		elem.result_area = $('<div>').addClass(css.re_area);
		//pagination bar
		if (p.pagination) elem.navi = $('<div>').addClass('sp_pagination').append('<ul>');
		elem.results = $('<ul>').addClass(css.results);

		var namePrefix = '_text',
			input_id = elem.combo_input.attr('id') || elem.combo_input.attr('name'),
			input_name = elem.combo_input.attr('name') || 'selectPage',
			hidden_name = input_name,
			hidden_id = input_id;

		//switch the id and name attributes of input/hidden element
		elem.hidden = $('<input type="hidden" class="sp_hidden" />').attr({
			name: hidden_name,
			id: hidden_id
		}).val('');
		elem.combo_input.attr({
			name: input_name + namePrefix,
			id: input_id + namePrefix
		});

		// 2. DOM element put
		elem.container.append(elem.hidden);
		if (p.dropButton) {
			elem.container.append(elem.button)
			elem.button.append(elem.dropdown);
		}
		$(document.body).append(elem.result_area);
		elem.result_area.append(elem.results);
		if (p.pagination) elem.result_area.append(elem.navi);

		//Multiple select mode
		if (p.multiple) {
			if (p.multipleControlbar) {
				elem.control.append('<button type="button" class="btn btn-default sp_clear_all" ><i class="sp-iconfont if-clear"></i></button>');
				elem.control.append('<button type="button" class="btn btn-default sp_unselect_all" ><i class="sp-iconfont if-unselect-all"></i></button>');
				elem.control.append('<button type="button" class="btn btn-default sp_select_all" ><i class="sp-iconfont if-select-all"></i></button>');
				elem.control_text = $('<p>');
				elem.control.append(elem.control_text);
				elem.result_area.prepend(elem.control);
			}
			elem.container.addClass('sp_container_combo');
			elem.combo_input.addClass('sp_combo_input').before(elem.element_box);
			var li = $('<li>').addClass('input_box');
			li.append(elem.combo_input);
			elem.element_box.append(li);
			if (elem.combo_input.attr('placeholder')) elem.combo_input.attr('placeholder_bak', elem.combo_input.attr('placeholder'));
		}

		this.elem = elem;
	};

	private setButtonAttrDefault() {
		/*
		if (this.option.selectOnly) {
			if ($(this.elem.combo_input).val() !== '') {
				if ($(this.elem.hidden).val() !== '') {
					//选择条件
					$(this.elem.combo_input).attr('title', this.message.select_ok).removeClass(this.css_class.select_ng).addClass(this.css_class.select_ok);
				} else {
					//输入方式
					$(this.elem.combo_input).attr('title', this.message.select_ng).removeClass(this.css_class.select_ok).addClass(this.css_class.select_ng);
				}
			} else {
				$(this.elem.hidden).val('');
				$(this.elem.combo_input).removeAttr('title').removeClass(this.css_class.select_ng);
			}
		}
		*/
		//this.elem.button.attr('title', this.message.get_all_btn);
		if (this.option.dropButton) this.elem.button.attr('title', this.option.message.close_btn);
	};

	private setInitRecord(refresh) {
		var self = this, p = self.option, el = self.elem, key = '' as String | number | string[];
		if ($.type(el.combo_input.data('init')) != 'undefined')
			p.initRecord = String(el.combo_input.data('init'));
		//data-init and value attribute can be init plugin selected item
		//but, if set data-init and value attribute in the same time, plugin will choose data-init attribute first
		if (!refresh && !p.initRecord && el.combo_input.val())
			p.initRecord = el.combo_input.val();
		el.combo_input.val('');
		if (!refresh) el.hidden.val(p.initRecord);
		key = refresh && el.hidden.val() ? el.hidden.val() : p.initRecord;
		if (key) {
			if (typeof p.data === 'object') {
				var data = new Array();
				var keyarr = String(key).split(',');
				$.each(keyarr, function (index, row) {
					for (var i = 0; i < p.data.length; i++) {
						if (p.data[i][p.keyField] == row) {
							data.push(p.data[i]);
							break;
						}
					}
				});
				if (!p.multiple && data.length > 1) data = [data[0]];
				self.afterInit(self, data);
			} else {//ajax data source mode to init selected item
				$.ajax({
					dataType: 'json',
					type: 'POST',
					url: p.data,
					data: {
						searchTable: p.dbTable,
						searchKey: p.keyField,
						searchValue: key
					},
					success: function (json) {
						var d = null;
						if (p.eAjaxSuccess && $.isFunction(p.eAjaxSuccess)) d = p.eAjaxSuccess(json);
						self.afterInit(self, d.list);
					},
					error: function () {
						self.ajaxErrorNotify(self);
					}
				});
			}
		}
	};

	private afterInit(self, data) {
		if (!data || ($.isArray(data) && data.length === 0)) return;
		if (!$.isArray(data)) data = [data];
		var p = self.option, css = self.css_class;

		var getText = function (row) {
			var text = row[p.showField];
			if (p.formatItem && $.isFunction(p.formatItem)) {
				try {
					text = p.formatItem(row);
				} catch (e) { }
			}
			return text;
		};

		if (p.multiple) {
			self.prop.init_set = true;
			self.clearAll(self);
			$.each(data, function (i, row) {
				var item = { text: getText(row), value: row[p.keyField] };
				if (!self.isAlreadySelected(self, item)) self.addNewTag(self, row, item);
			});
			self.tagValuesSet(self);
			self.inputResize(self);
			self.prop.init_set = false;
		} else {
			var row = data[0];
			self.elem.combo_input.val(getText(row));
			self.elem.hidden.val(row[p.keyField]);
			self.prop.prev_value = getText(row);
			self.prop.selected_text = getText(row);
			if (p.selectOnly) {
				self.elem.combo_input.attr('title', self.message.select_ok).removeClass(css.select_ng).addClass(css.select_ok);
			}
			self.putClearButton();
		}
	};

	private eDropdownButton() {
		var self = this;
		if (self.option.dropButton) {
			self.elem.button.mouseup(function (ev) {
				ev.stopPropagation();
				if (self.elem.result_area.is(':hidden') && !self.elem.combo_input.prop('disabled')) {
					self.elem.combo_input.focus();
				} else self.hideResults(self);
			});
		}
	};

	/**
 * Events bind
 */
	private eInput() {
		var self = this, p = self.option, el = self.elem, msg = self.option.message;
		var showList = function () {
			self.prop.page_move = false;
			self.suggest(self);
			self.setCssFocusedInput(self);
		};
		el.combo_input.keyup(function (e) {
			self.processKey(self, e);
		}).keydown(function (e) {
			self.processControl(self, e);
		}).focus(function (e) {
			//When focus on input, show the result list
			if (el.result_area.is(':hidden')) {
				e.stopPropagation();
				self.prop.first_show = true;
				showList();
			}
		});
		el.container.on('click.SelectPage', 'div.' + self.option.css_class.clear_btn, function (e) {
			e.stopPropagation();
			if (!self.disabled(self, true)) {
				self.clearAll(self, true);
				if (p.eClear && $.isFunction(p.eClear)) p.eClear(self);
			}
		});
		el.result_area.on('mousedown.SelectPage', function (e) {
			e.stopPropagation();
		});
		if (p.multiple) {
			if (p.multipleControlbar) {
				//Select all item of current page
				el.control.find('.sp_select_all').on('click.SelectPage', function () {
					self.selectAllLine(self);
				}).hover(function () {
					el.control_text.html(msg.select_all);
				}, function () {
					el.control_text.html('');
				});
				//Cancel select all item of current page
				el.control.find('.sp_unselect_all').on('click.SelectPage', function () {
					self.unSelectAllLine(self);
				}).hover(function () {
					el.control_text.html(msg.unselect_all);
				}, function () {
					el.control_text.html('');
				});
				//Clear all selected item
				el.control.find('.sp_clear_all').on('click.SelectPage', function () {
					self.clearAll(self, true);
				}).hover(function () {
					el.control_text.html(msg.clear_all);
				}, function () {
					el.control_text.html('');
				});
			}
			el.element_box.on('click.SelectPage', function (e: Event) {
				var srcEl = e.target || e.srcElement;
				if ($(srcEl).is('ul')) el.combo_input.focus();
			});
			//Tag close
			el.element_box.on('click.SelectPage', 'span.tag_close', function () {
				var li = $(this).closest('li'), data = li.data('dataObj');
				self.removeTag(self, li);
				showList();
				if (p.eTagRemove && $.isFunction(p.eTagRemove)) p.eTagRemove([data]);
			});
			self.inputResize(self);
		}
	};

	private eWhole() {
		var self = this, css = self.option.css_class;
		var cleanContent = function (obj) {
			obj.elem.combo_input.val('');
			if (!obj.option.multiple) obj.elem.hidden.val('');
			obj.prop.selected_text = '';
		};

		//Out of plugin area
		$(document.body).off('mousedown.selectPage').on('mousedown.selectPage', function (e: Event) {
			var ele = e.target || e.srcElement;
			var sp = $(ele).closest('div.' + css.container);
			//Open status result list
			$('div.' + css.container + '.' + css.container_open).each(function () {
				if (this == sp[0]) return;
				var $this = $(this), d = $this.find('input.' + css.input).data(self.option.datakey);

				if (!d.elem.combo_input.val() && d.elem.hidden.val() && !d.option.multiple) {
					d.prop.current_page = 1;//reset page to 1
					cleanContent(d);
					d.hideResults(d);
					return false;
				}
				if (d.elem.results.find('li').not('.' + css.message_box).length) {
					if (d.option.autoFillResult) {
						//have selected item, then hide result list
						if (d.elem.hidden.val()) d.hideResults(d);
						else if (d.elem.results.find('li.sp_over').length) {
							//no one selected and have highlight item, select the highlight item
							d.selectCurrentLine(d);
						} else if (d.option.autoSelectFirst) {
							//no one selected, no one highlight, select the first item
							d.nextLine(d);
							d.selectCurrentLine(d);
						} else d.hideResults(d);
					} else d.hideResults(d);
				} else {
					//when no one item match, clear search keywords
					if (d.option.noResultClean) cleanContent(d);
					else {
						if (!d.option.multiple) d.elem.hidden.val('');
					}
					d.hideResults(d);
				}
			});
		});
	};

	/**
     * auto resize input element width in multiple select mode
	 * @param {Object} self
	 */
	private inputResize(self) {
		if (!self.option.multiple) return;
		var inputLi = self.elem.combo_input.closest('li');
		var setDefaultSize = function (self, inputLi) {
			inputLi.removeClass('full_width');
			var minimumWidth = self.elem.combo_input.val().length + 1,
				width = (minimumWidth * 0.75) + 'em';
			self.elem.combo_input.css('width', width).removeAttr('placeholder');
		};
		if (self.elem.element_box.find('li.selected_tag').length === 0) {
			if (self.elem.combo_input.attr('placeholder_bak')) {
				if (!inputLi.hasClass('full_width')) inputLi.addClass('full_width');
				self.elem.combo_input.attr('placeholder', self.elem.combo_input.attr('placeholder_bak')).removeAttr('style');
			} else setDefaultSize(self, inputLi);
		} else setDefaultSize(self, inputLi);
	};

	private ajaxErrorNotify(self) {
		self.showMessage(self.message.ajax_error);
	};

	private hideResults(self) {
		if (self.prop.key_paging) {
			self.scrollWindow(self, true);
			self.prop.key_paging = false;
		}
		self.setCssFocusedInput(self);

		if (self.option.autoFillResult) {
			//self.selectCurrentLine(self, true);
		}

		self.elem.results.empty();
		self.elem.result_area.hide();
		self.setOpenStatus(self, false);
		//unbind window scroll listen
		$(window).off('scroll.SelectPage');

		self.abortAjax(self);
		self.setButtonAttrDefault();
	};

	/**
 	* Suggest result of search keywords
 	* @param {Object} self
	 */
	private suggest(self) {
		var q_word, val = $.trim(self.elem.combo_input.val());
		if (self.option.multiple) q_word = val;
		else {
			if (val && val === self.prop.selected_text) q_word = '';
			else q_word = val;
		}
		q_word = q_word.split(/[\s　]+/);

		//Before show up result list callback
		if (self.option.eOpen && $.isFunction(self.option.eOpen))
			self.option.eOpen.call(self);

		self.abortAjax(self);
		//self.setLoading(self);
		var which_page_num = self.prop.current_page || 1;

		if (typeof self.option.data == 'object') self.searchForJson(self, q_word, which_page_num);
		else self.searchForDb(self, q_word, which_page_num);
	};

	/**
	* input element in focus css class set
	* @param {Object} self
	*/
	private setCssFocusedInput = function (self) {
		// $(self.elem.results).addClass(self.css_class.re_off);
		// $(self.elem.combo_input).removeClass(self.css_class.input_off);
	};

	/**
	* Input handle（regular input）
	* @param {Object} self
	* @param {Object} e - event object
	*/
	private processKey(self, e) {
		if ($.inArray(e.keyCode, [37, 38, 39, 40, 27, 9, 13]) === -1) {
			if (e.keyCode != 16) self.setCssFocusedInput(self); // except Shift(16)
			self.inputResize(self);
			if ($.type(self.option.data) === 'string') {
				self.prop.last_input_time = e.timeStamp;
				setTimeout(function () {
					if ((e.timeStamp - self.prop.last_input_time) === 0)
						self.checkValue(self);
				}, self.option.inputDelay * 1000);
			} else {
				self.checkValue(self);
			}
		}
	};

	/**
	* Input handle（control key）
	* @param {Object} self
	* @param {Object} e - event object
	*/
	private processControl(self, e) {
		if (($.inArray(e.keyCode, [37, 38, 39, 40, 27, 9]) > -1 && self.elem.result_area.is(':visible')) ||
			($.inArray(e.keyCode, [13, 9]) > -1 && self.getCurrentLine(self))) {
			e.preventDefault();
			e.stopPropagation();
			e.cancelBubble = true;
			e.returnValue = false;
			switch (e.keyCode) {
				case 37:// left
					if (e.shiftKey) self.firstPage(self);
					else self.prevPage(self);
					break;
				case 38:// up
					self.prop.key_select = true;
					self.prevLine(self);
					break;
				case 39:// right
					if (e.shiftKey) self.lastPage(self);
					else self.nextPage(self);
					break;
				case 40:// down
					if (self.elem.results.children('li').length) {
						self.prop.key_select = true;
						self.nextLine(self);
					} else self.suggest(self);
					break;
				case 9:// tab
					self.prop.key_paging = true;
					self.selectCurrentLine(self);
					//self.hideResults(self);
					break;
				case 13:// return
					self.selectCurrentLine(self);
					break;
				case 27://  escape
					self.prop.key_paging = true;
					self.hideResults(self);
					break;
			}
		}
	};

	/**
	* set plugin to disabled / enabled
	* @param self
	* @param disabled
	*/
	private disabled(self, disabled) {
		var el = self.elem;
		if ($.type(disabled) === 'undefined') return el.combo_input.prop('disabled');
		if ($.type(disabled) === 'boolean') {
			el.combo_input.prop('disabled', disabled);
			if (disabled) el.container.addClass(self.css_class.disabled);
			else el.container.removeClass(self.css_class.disabled);
		}
	};

	/**
	* Clear all selected items
	* @param {Object} self
	* @param {boolean} open - open list after clear selected item
	*/
	private clearAll(self, open) {
		var p = self.option, ds = [];
		if (p.multiple) {
			self.elem.element_box.find('li.selected_tag').each(function (i, row) {
				ds.push($(row).data('dataObj'));
				row.remove();
			});
			self.elem.element_box.find('li.selected_tag').remove();
		}
		self.reset(self);
		self.afterAction(self, open);

		if (p.multiple) {
			if (p.eTagRemove && $.isFunction(p.eTagRemove)) p.eTagRemove(ds);
		} else self.elem.clear_btn.remove();
	};

	/**
	* Select all list item
	* @param {Object} self
	*/
	private selectAllLine(self) {
		var p = self.option, jsonarr = new Array();
		self.elem.results.find('li').each(function (i, row) {
			var $row = $(row), data = $row.data('dataObj');
			var item = { text: $row.text(), value: $row.attr('pkey') };
			if (!self.isAlreadySelected(self, item)) {
				self.addNewTag(self, data, item);
				self.tagValuesSet(self);
			}
			jsonarr.push(data);
			//limited max selected items
			if ($.type(p.maxSelectLimit) === 'number' &&
				p.maxSelectLimit > 0 &&
				p.maxSelectLimit === self.elem.element_box.find('li.selected_tag').length) {
				return false;
			}
		});
		if (p.eSelect && $.isFunction(p.eSelect)) p.eSelect(jsonarr, self);
		self.afterAction(self, true);
	};

	/**
	* Cancel select all item in current page
	* @param {Object} self
	*/
	private unSelectAllLine(self) {
		var p = self.option, ds = [];
		self.elem.results.find('li').each(function (i, row) {
			var key = $(row).attr('pkey');
			var tag = self.elem.element_box.find('li.selected_tag[itemvalue="' + key + '"]');
			if (tag.length) ds.push(tag.data('dataObj'));
			self.removeTag(self, tag);
		});
		self.afterAction(self, true);
		if (p.eTagRemove && $.isFunction(p.eTagRemove)) p.eTagRemove(ds);
	};

	/**
	* Remove a tag in multiple selection mode
	* @param {Object} self
	* @param {Object} item
	*/
	private removeTag(self, item) {
		var key = $(item).attr('itemvalue');
		var keys = self.elem.hidden.val();
		if ($.type(key) != 'undefined' && keys) {
			var keyarr = keys.split(','),
				index = $.inArray(key.toString(), keyarr);
			if (index != -1) {
				keyarr.splice(index, 1);
				self.elem.hidden.val(keyarr.toString());
			}
		}
		$(item).remove();
		self.inputResize(self);
	};

	/**
	* Select current list item
	* @param {Object} self
	*/
	private selectCurrentLine(self) {
		self.scrollWindow(self, true);

		var p = self.option, current = self.getCurrentLine(self);
		if (current) {
			var data = current.data('dataObj');
			if (!p.multiple) {
				self.elem.combo_input.val(current.text());
				self.elem.hidden.val(current.attr('pkey'));
			} else {
				//build tags in multiple selection mode
				self.elem.combo_input.val('');
				var item = { text: current.text(), value: current.attr('pkey') };
				if (!self.isAlreadySelected(self, item)) {
					self.addNewTag(self, data, item);
					self.tagValuesSet(self);
				}
			}

			if (p.selectOnly) self.setButtonAttrDefault();

			//Select item callback
			if (p.eSelect && $.isFunction(p.eSelect)) p.eSelect(data, self);

			self.prop.prev_value = self.elem.combo_input.val();
			self.prop.selected_text = self.elem.combo_input.val();

			self.putClearButton();
		}
		self.afterAction(self, true);
	};

	/**
	* Move to next line
	* @param {Object} self
	*/
	private nextLine(self) {
		var obj = self.getCurrentLine(self), idx;
		if (!obj) idx = -1;
		else {
			idx = self.elem.results.children('li').index(obj);
			obj.removeClass(self.css_class.select);
		}
		idx++;
		if (idx < self.elem.results.children('li').length) {
			var next = self.elem.results.children('li').eq(idx);
			next.addClass(self.css_class.select);
			self.setCssFocusedResults(self);
		} else self.setCssFocusedInput(self);
		self.scrollWindow(self, false);
	};
}
export default select;
