import settings
from data import pool
from flask import Flask, render_template, request

app = Flask(__name__, template_folder="templates")

@app.route('/dashboard')
def dashboard():
    return render_template(
        'dashboard.html',
        title='Dashboard',
        desc='dashboard',
        tags=["dashboard"],
        currentPage="dashboard",
        data=pool.get_staking_pool_data(),
        wallet=request.cookies.get('wallet')
    )

@app.route('/allocations')
def allocations():
    return render_template(
        'allocations.html',
        title='Allocations',
        desc='allocations',
        tags=["allocations"],
        currentPage="allocations",
        data=pool.get_covered_protocols(),
        wallet=request.cookies.get('wallet')
    )


@app.route('/')
def landing():
    return render_template(
        'landing.html',
        title='Landing',
        desc='landing',
        tags=["landing"],
        currentPage="landing",
        data=pool.get_pool_strategies(),
        wallet=false
    )

if __name__ == '__main__':
    # print(pool.get_staking_pool_data())
    # print(pool.get_covered_protocols())
    # print(pool.get_pool_strategies())
    app.run(host=settings.SERVER_HOST, port=settings.SERVER_PORT)
