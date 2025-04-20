def test_register_login_and_crud(client):
    response = client.post("/register", json={
        "username": "testuser",
        "password": "secret",
        "email": "test@example.com"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@example.com"

    # Login to get token
    response = client.post(
        "/token",
        data={"username": "testuser", "password": "secret"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    assert response.status_code == 200
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create a learning log
    log_payload = {
        "date": "2025-04-20",
        "platform": "LeetCode",
        "topics": "Arrays, Hashing",
        "time_spent": 2.5,
        "problems_solved": 3
    }
    response = client.post("/log", json=log_payload, headers=headers)
    assert response.status_code == 200
    log_data = response.json()
    assert log_data["platform"] == "LeetCode"
    assert log_data["problems_solved"] == 3

    # Retrieve logs
    response = client.get("/logs", headers=headers)
    assert response.status_code == 200
    logs = response.json()
    assert isinstance(logs, list)
    assert logs[0]["platform"] == "LeetCode"

    # Retrieve stats
    response = client.get("/stats", headers=headers)
    assert response.status_code == 200
    stats = response.json()
    assert stats["total_time"] == 2.5
    assert stats["total_problems"] == 3

    # Set a goal
    goal_payload = {
        "description": "Solve 50 problems",
        "target_problems": 50,
        "deadline": "2025-05-31"
    }
    response = client.post("/goal", json=goal_payload, headers=headers)
    assert response.status_code == 200
    goal = response.json()
    assert goal["description"] == "Solve 50 problems"

    # Retrieve goals
    response = client.get("/goals", headers=headers)
    assert response.status_code == 200
    goals = response.json()
    assert isinstance(goals, list)
    assert goals[0]["target_problems"] == 50
