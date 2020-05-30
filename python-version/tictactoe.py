"""
Tic Tac Toe Player
"""

from copy import deepcopy

X = "X"
O = "O"
EMPTY = None


def initial_state():
    """
    Returns starting state of the board.
    """
    return [[EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]]


def player(board):
    """
    Returns player who has the next turn on a board.
    """
    # Unpacking 2D Board into 1D
    moves = [move for row in board for move in row]
    # As X always goes first, if X'es are equal to O'es, its X move else its O's
    return X if moves.count(X) == moves.count(O) else O


def actions(board):
    """
    Returns set of all possible actions (i, j) available on the board.
    """
    actions = []
    for i,row in enumerate(board):
        for j,val in enumerate(row):
            if val == EMPTY:
                actions.append((i, j))
    return actions


def result(board, action):
    """
    Returns the board that results from making move (i, j) on the board.
    """
    # As Python Works on Call by reference, To copy a 2D array, we use deepcopy
    newBoard = deepcopy(board)
    newBoard[action[0]][action[1]] = player(board)
    return newBoard


def winner(board):
    """
    Returns the winner of the game, if there is one.
    """
    for move in [X,O]:
        # Checking Vertically and Horizontally
        for i in range(3):
            if board[i][0] == board[i][1] == board[i][2] == move:
                return move
            if board[0][i] == board[1][i] == board[2][i] == move:
                return move
        # Checking on Cross
        if board[0][0] == board[1][1] == board[2][2] == move:
            return move
        if board[0][2] == board[1][1] == board[2][0] == move:
            return move
    return None


def terminal(board):
    """
    Returns True if game is over, False otherwise.
    """
    # Unpacking 2D Board into 1D
    moves = [move for row in board for move in row]
    # if winner function dosen't returns None (Somebody won) or No chance left then returning True
    return True if winner(board) != None or None not in moves else False


def utility(board):
    """
    Returns 1 if X has won the game, -1 if O has won, 0 otherwise.
    """
    win = winner(board)
    if win == X:
        return 1
    if win == O:
        return -1
    return 0


def minimax(board, called_first_time=True):
    """
    Returns the optimal action for the current player on the board if called first time.
    else action_score
    """
    available_actions = actions(board)
    actions_score = []

    for action in available_actions:
        resultBoard = result(board, action)
        if terminal(resultBoard):
            actions_score.append(utility(resultBoard))
            continue
        n = minimax(resultBoard, False)
        actions_score.append(n)

        # Breaking if Max/Min score is already found (no need to search more)
        if player(board) == X and n == 1:
            break
        if player(board) == O and n == -1:
            break

    # Getting Max/Min Score according to player
    score = 0
    if player(board) == X:
        score = max(actions_score)
    else:
        score = min(actions_score)
    
    # Returning action if called for the first time
    if called_first_time:
        return available_actions[actions_score.index(score)]
    else:
        return score