var choice_cross = document.getElementById("choice_cross");
var choice_zero = document.getElementById("choice_zero");

const src_img_cross = choice_cross.src;
const src_img_zero = choice_zero.src;
const src_img_default = "img/cell_background.png";

const player_state_enum = {'cross': 'cross', 'zero': 'zero', 'none': ''};

var user_state = player_state_enum.none;
var computer_state = player_state_enum.none;

var cells = document.getElementsByClassName('cell');
var game_state = new Array(cells.length);
var indexes_of_free_cells = new Array(cells.length);

const game_phase_enum = {"start": 0, "game": 1};
var game_phase = game_phase_enum.start;

const winning_combinations = [
	[0,1,2], [3,4,5], [6,7,8], [0,3,6],
	[1,4,7], [2,5,8], [0,4,8], [2,4,6]
];

function cell_click(){
	if(game_phase != game_phase_enum.game) {
		return;
	}

	var current_id = Number.parseInt(this.id.substr('cell'.length)) - 1;
	if(game_state[current_id] != 0){
		return;
	}

	game_state[current_id] = user_state;

	var index = indexes_of_free_cells.indexOf(current_id);
	if(index != -1){
		indexes_of_free_cells.splice(index, 1);
	}
	
	draw_field(game_state, cells);
	
	if(is_win(game_state, user_state)) {
		alert('Вы победили!');
		reset_game();
		return;
	}
	if(is_end_game(game_state)) {
		alert('Ничья!');
		reset_game();
		return;
	}
	step_computer();
}  

function calculate_step_computer(){
	var win_cell = win_step(game_state, winning_combinations, computer_state);
	if(win_cell > -1) {
		return win_cell;
	}

	var not_win_user_cell = win_step(game_state, winning_combinations, user_state);
	if(not_win_user_cell > -1){
		return not_win_user_cell;
	}

	var index_rand = Math.floor(Math.random() * indexes_of_free_cells.length);
	var id_rand = indexes_of_free_cells[index_rand];
	return id_rand;

}

function step_computer(){
	var next_step = calculate_step_computer();
	var index_next_step = indexes_of_free_cells.indexOf(next_step);

	game_state[next_step] = computer_state;
	indexes_of_free_cells.splice(index_next_step, 1);
	
	draw_field(game_state, cells);
	if(is_win(game_state, computer_state)) {
		alert('Компьютер победил!');
		reset_game();
		return;
	}
	if(is_end_game(game_state)) {
		alert('Ничья!');
		reset_game();
		return;
	}
}

function draw_field(game_state, cells){
	for (var i = 0; i < game_state.length; i++) {
		switch(game_state[i]){
			case player_state_enum.cross:
				cells[i].children[0].src = src_img_cross;
				break;
			case player_state_enum.zero:
				cells[i].children[0].src = src_img_zero;
				break;
			default:
				cells[i].children[0].src = src_img_default;
				break;
		}
	}
}

function is_win(game_state, player){
	var gs = game_state;
	var combination;
	for (var i = 0; i < winning_combinations.length; i++) {
		combination = winning_combinations[i];
		if(gs[combination[0]] == player && gs[combination[1]] == player && gs[combination[2]] == player){
			return true;
		}
	}
	return false;
}

function is_end_game(game_state){
	for(var i = 0; i < game_state.length; i++) {
		if(game_state[i] == 0){
			return false;
		}
	}
	return true;
}

function start_game_cross(){
	if(game_phase == game_phase_enum.start) {
		user_state = player_state_enum.cross;
		computer_state = player_state_enum.zero;
		choice_cross.classList.add('choice-border');
		choice_zero.classList.remove('choice-border');
		game_phase = game_phase_enum.game;
	}
}

function start_game_zero(){
	if(game_phase == game_phase_enum.start) {
		user_state = player_state_enum.zero;
		computer_state = player_state_enum.cross;
		choice_cross.classList.remove('choice-border');
		choice_zero.classList.add('choice-border');
		game_phase = game_phase_enum.game;
		step_computer();
	}
}

function reset_game(){
	choice_cross.classList.remove('choice-border');
	choice_zero.classList.remove('choice-border');

	user_state = player_state_enum.none;
	computer_state = player_state_enum.none;

	for(var i = 0; i < game_state.length; i++) {
		game_state[i] = 0;
		indexes_of_free_cells[i] = i;
	}
	draw_field(game_state, cells);
	game_phase = game_phase_enum.start;
}

function win_step(game_state, winning_combinations, state){
	var combination;
	var cell_1;
	var cell_2;
	var cell_3;
	for (var i = 0; i < winning_combinations.length; i++) {
		combination = winning_combinations[i];
		cell_1 = combination[0];
		cell_2 = combination[1];
		cell_3 = combination[2];

		if(game_state[cell_2] == game_state[cell_3] && 
			game_state[cell_1] == 0 && 
			game_state[cell_2] == state){
			return cell_1;
		}
		if(game_state[cell_1] == game_state[cell_3] && 
			game_state[cell_2] == 0 && 
			game_state[cell_1] == state){
			return cell_2;
		}
		if(game_state[cell_1] == game_state[cell_2] && 
			game_state[cell_3] == 0 && 
			game_state[cell_1] == state){
			return cell_3;
		}
	}
	return -1;
}

for(var i = 0; i < cells.length; i++) {
	cells[i].addEventListener("click", cell_click)
}

document.addEventListener("DOMContentLoaded", reset_game);